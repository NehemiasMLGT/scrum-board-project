import React from 'react';
import { HelpCircle, X, CheckCircle, Clock, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export default function HelpModal({ isOpen, onClose }) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      data-testid="help-modal-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5 text-blue-600">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {t('help.title')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('help.subtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="help-modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            title={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* Concepto Stand-up */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4">
            <h3 className="font-bold text-blue-950 flex items-center gap-2 mb-1.5">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              {t('help.whatIsStandupTitle')}
            </h3>
            <p className="text-xs text-blue-900/90 leading-relaxed">
              {t('help.whatIsStandupDesc')}
            </p>
          </div>

          {/* Las 3 Preguntas Clave */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              {t('help.threeQuestionsTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              {t('help.threeQuestionsIntro')}
            </p>

            <div className="space-y-2.5">
              {/* Pregunta 1 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  {t('help.q1Title')}
                </div>
                <p className="text-xs text-slate-600 pl-6.5">
                  {t('help.q1Desc')}
                </p>
              </div>

              {/* Pregunta 2 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  {t('help.q2Title')}
                </div>
                <p className="text-xs text-slate-600 pl-6.5">
                  {t('help.q2Desc')}
                </p>
              </div>

              {/* Pregunta 3 */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="font-bold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  {t('help.q3Title')}
                </div>
                <p className="text-xs text-slate-600 pl-6.5">
                  {t('help.q3Desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Reglas de Oro */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">
              {t('help.rulesTitle')}
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>{t('help.rule1')}</li>
              <li>{t('help.rule2')}</li>
              <li>{t('help.rule3')}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-98"
          >
            {t('help.gotItBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
