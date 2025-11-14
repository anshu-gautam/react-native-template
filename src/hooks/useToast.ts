/**
 * React Hook for Toast Notifications
 *
 * Provides easy access to toast notifications within React components
 */

import { useEffect, useState } from 'react';
import { toast, type Toast, type ToastOptions } from '@/services/toast';

/**
 * Hook to display and manage toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return {
    toasts,
    show: (options: ToastOptions) => toast.show(options),
    success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      toast.success(message, options),
    error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      toast.error(message, options),
    warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      toast.warning(message, options),
    info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      toast.info(message, options),
    hide: (id: string) => toast.hide(id),
    hideAll: () => toast.hideAll(),
  };
}
