import { Toaster } from 'sonner';

export function ToasterWithTheme() {
  return (
    <Toaster
      theme="light"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-white border border-border shadow-lg',
          title: 'font-medium',
          description: 'text-muted-foreground',
          success: 'bg-green-50 border-green-200 text-green-900',
          error: 'bg-red-50 border-red-200 text-red-900',
          warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        },
      }}
    />
  );
}

export { Toaster };
