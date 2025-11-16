/**
 * Global Modal Store
 *
 * Manages global modals with stacking support
 */

import { create } from 'zustand';

export interface ModalConfig {
  id: string;
  type: 'confirmation' | 'alert' | 'input' | 'custom';
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
  customComponent?: React.ComponentType<{ onClose: () => void }>;
  variant?: 'success' | 'error' | 'warning' | 'info';
  inputPlaceholder?: string;
  inputValue?: string;
}

interface ModalStore {
  modals: ModalConfig[];
  show: (config: Omit<ModalConfig, 'id'>) => string;
  hide: (id: string) => void;
  hideAll: () => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
  modals: [],

  show: (config) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const modal: ModalConfig = { ...config, id };

    set((state) => ({
      modals: [...state.modals, modal],
    }));

    return id;
  },

  hide: (id) => {
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== id),
    }));
  },

  hideAll: () => {
    set({ modals: [] });
  },
}));

/**
 * Custom hook for easier modal management
 */
export const useModal = () => {
  const { show, hide, hideAll } = useModalStore();

  return {
    showConfirmation: (config: Omit<ModalConfig, 'id' | 'type'>) =>
      show({ ...config, type: 'confirmation' }),
    showAlert: (config: Omit<ModalConfig, 'id' | 'type'>) =>
      show({ ...config, type: 'alert' }),
    showInput: (config: Omit<ModalConfig, 'id' | 'type'>) =>
      show({ ...config, type: 'input' }),
    showCustom: (config: Omit<ModalConfig, 'id' | 'type'>) =>
      show({ ...config, type: 'custom' }),
    hide,
    hideAll,
  };
};
