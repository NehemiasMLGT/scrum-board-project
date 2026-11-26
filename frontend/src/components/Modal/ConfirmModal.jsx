import React, { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/I18nContext';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmVariant = 'primary', // 'primary', 'danger'
  hasInput = false,
  inputType = 'text',
  inputValue = '',
  inputLabel = '',
  onInputChange = () => {},
  onConfirm,
  onCancel,
  inputTestId = 'modal-form-input'
}) {
  const { t } = useI18n();
  const inputRef = useRef(null);

  const finalConfirmText = confirmText || t('yes');
  const finalCancelText = cancelText || t('no');

  useEffect(() => {
    if (isOpen && hasInput && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen, hasInput]);

  if (!isOpen) return null;

  const confirmColors = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  }[confirmVariant] || 'bg-blue-600 hover:bg-blue-700 text-white';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      data-testid="modal-dialog-container"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-6">
          <h3
            data-testid="modal-dialog-title"
            className="text-lg font-bold text-slate-900 mb-2"
          >
            {title}
          </h3>
          {message && (
            <p
              data-testid="modal-dialog-message"
              className="text-sm text-slate-600 mb-4 whitespace-pre-line"
            >
              {message}
            </p>
          )}

          {hasInput && (
            <div className="mb-4">
              {inputLabel && (
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  {inputLabel}
                </label>
              )}
              <input
                ref={inputRef}
                type={inputType}
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                data-testid={inputTestId}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              data-testid="modal-btn-cancel"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {finalCancelText}
            </button>
            <button
              type="button"
              data-testid="modal-btn-confirm"
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${confirmColors}`}
            >
              {finalConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
