import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { HomePage } from "./pages/HomePage";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { BulkOrderPage } from "./pages/BulkOrderPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import { BulkOrderProvider } from "./context/BulkOrderContext";
import { AuthProvider } from "./context/AuthContext";
import { type ReactNode, useEffect } from "react";

// Protected Route Component
function ProtectedRoute({ children, redirectTo = "/auth/login" }: { children: ReactNode; redirectTo?: string }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

// Auth Route Component (redirects to home if already logged in)
function AuthRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/preview_page.html" element={<HomePage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:category" element={<ProductListPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />

      {/* Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path="/auth/signup"
        element={
          <AuthRoute>
            <SignupPage />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bulk-orders"
        element={
          <ProtectedRoute>
            <BulkOrderPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BulkOrderProvider>
          <Router>
            <ScrollToTop />
            <AppRoutes />
            <Toaster position="bottom-right" theme="light" />
          </Router>
        </BulkOrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
