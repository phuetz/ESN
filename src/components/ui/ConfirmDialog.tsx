import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-500',
          button: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          icon: 'text-yellow-500',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
      default:
        return {
          icon: 'text-blue-500',
          button: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>>({
    title: '',
    message: '',
  });
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = (
    title: string,
    message: string,
    options?: Partial<Pick<ConfirmDialogProps, 'confirmText' | 'cancelText' | 'variant'>>
  ): Promise<boolean> => {
    setConfig({
      title,
      message,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      variant: options?.variant,
    });
    setIsOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    resolveRef.current?.(false);
  };

  const handleConfirm = () => {
    resolveRef.current?.(true);
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      {...config}
    />
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
};
