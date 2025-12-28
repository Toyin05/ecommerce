import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products";

interface BulkOrderItem {
  product: Product;
  quantity: number;
  customization?: {
    logo?: string;
    message?: string;
    packaging?: string;
    deliveryNote?: string;
  };
}

interface BulkOrderContextType {
  items: BulkOrderItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateCustomization: (productId: number, customization: BulkOrderItem['customization']) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearOrder: () => void;
}

const BulkOrderContext = createContext<BulkOrderContextType | null>(null);

export function BulkOrderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BulkOrderItem[]>([]);

  const addItem = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product, quantity }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 10) return; // Minimum order quantity
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateCustomization = (productId: number, customization: BulkOrderItem['customization']) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId 
          ? { ...item, customization: { ...item.customization, ...customization } }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.product.price.replace("$", ""));
      return sum + price * item.quantity;
    }, 0);
  };

  const clearOrder = () => {
    setItems([]);
  };

  return (
    <BulkOrderContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateCustomization,
        getTotalItems,
        getTotalPrice,
        clearOrder,
      }}
    >
      {children}
    </BulkOrderContext.Provider>
  );
}

export function useBulkOrder() {
  const context = useContext(BulkOrderContext);
  if (!context) {
    throw new Error("useBulkOrder must be used within BulkOrderProvider");
  }
  return context;
}
