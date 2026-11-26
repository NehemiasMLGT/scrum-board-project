import React, { useState } from 'react';
import { Play, Pause, SkipForward, Plus, Edit3, Clock, Globe, HelpCircle } from 'lucide-react';
import ConfirmModal from '../Modal/ConfirmModal';
import HelpModal from './HelpModal';
import { useI18n } from '../../i18n/I18nContext';

export default function Header({
  team,
  timerSeconds,
  initialSeconds,
  isTimerRunning,
  onToggleTimer,
  onSkipTurn,
  onUpdateTeamName,
  onUpdateTimerSeconds,
  onAddTeamClick
}) {
  const { t, language, setLanguage, availableLanguages } = useI18n();

  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');

  const [showEditTimerModal, setShowEditTimerModal] = useState(false);
  const [timerInput, setTimerInput] = useState('');

  const [showHelpModal, setShowHelpModal] = useState(false);

  // Calculate percentage of remaining time
  const maxSeconds = initialSeconds > 0 ? initialSeconds : 120;
  const percentage = Math.max(0, Math.min(100, Math.round((timerSeconds / maxSeconds) * 100)));

  // Color according to business rules:
  // 100% - 31%: Black
  // 30% - 11%: Yellow
  // 10% - 0%: Red
  const getTimerColorClass = () => {
    if (percentage >= 31) return 'text-slate-900';
    if (percentage >= 11) return 'text-amber-500';
    return 'text-rose-600 animate-pulse';
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTeamNameContextMenu = (e) => {
    e.preventDefault();
    setTeamNameInput(team?.name || '');
    setShowEditTeamModal(true);
  };

  const handleTimerClickOrContextMenu = (e) => {
    e.preventDefault();
    setTimerInput(String(initialSeconds || 120));
    setShowEditTimerModal(true);
  };

  const handleConfirmEditTeam = () => {
    if (teamNameInput.trim()) {
      onUpdateTeamName(teamNameInput.trim());
      setShowEditTeamModal(false);
    }
  };

  const handleConfirmEditTimer = () => {
    const parsed = parseInt(timerInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateTimerSeconds(parsed);
      setShowEditTimerModal(false);
    }
  };

  return (
    <header
      data-testid="header-container"
      className="h-[20vh] min-h-[140px] max-h-[180px] w-full bg-white border-b-2 border-slate-200 px-8 py-3 flex items-center justify-between shadow-sm select-none relative"
    >
      {/* Mitad Izquierda: Nombre de Team y botón Agregar Team */}
      <div className="flex flex-col justify-center gap-2 max-w-[45%]">
        <div className="flex items-center gap-2 group cursor-context-menu">
          <h1
            data-testid="header-team-name"
            onContextMenu={handleTeamNameContextMenu}
            title={t('header.editTeamTooltip')}
            className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight hover:text-blue-600 transition-colors truncate"
          >
            {team?.name || t('header.loadingTeam')}
          </h1>
          <button
            type="button"
            onClick={handleTeamNameContextMenu}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity p-1 rounded hover:bg-slate-100"
            title={t('header.editTeamTooltip')}
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div>
          <button
            type="button"
            data-testid="header-btn-add-team"
            onClick={onAddTeamClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('header.addTeamBtn')}</span>
          </button>
        </div>
      </div>

      {/* Mitad Derecha: Cronómetro, Controles, Selector de Idioma y Botón de Ayuda */}
      <div className="flex items-center gap-6">
        {/* Cronómetro editable con semáforo dinámico */}
        <div className="flex flex-col items-center">
          <div
            data-testid="timer-display"
            onClick={handleTimerClickOrContextMenu}
            onContextMenu={handleTimerClickOrContextMenu}
            title={t('header.editTimerTitle')}
            className={`font-mono text-5xl lg:text-6xl font-black tracking-wider cursor-pointer transition-colors duration-200 ${getTimerColorClass()}`}
          >
            {formatTime(timerSeconds)}
          </div>
          <span className="text-[11px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" /> {t('header.timeRemaining')} ({percentage}%)
          </span>
        </div>

        {/* Botón Play/Pausa y debajo botón Skip */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-testid="timer-btn-toggle"
            onClick={onToggleTimer}
            className={`w-28 py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider text-white shadow transition-all ${
              isTimerRunning
                ? 'bg-amber-500 hover:bg-amber-600 active:scale-95'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>{t('header.pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t('header.play')}</span>
              </>
            )}
          </button>

          <button
            type="button"
            data-testid="timer-btn-skip"
            onClick={onSkipTurn}
            className="w-28 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-xs tracking-wide bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 active:scale-95 transition-all"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>{t('header.skip')}</span>
          </button>
        </div>

        {/* Cluster de Utilidades: Idioma + Botón Help */}
        <div className="flex flex-col items-end gap-2 pl-4 border-l border-slate-200">
          {/* Dropdown de Idioma */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              data-testid="language-select-dropdown"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de Ayuda (Help / Ayuda / Hilfe) */}
          <button
            type="button"
            data-testid="btn-help-modal"
            onClick={() => setShowHelpModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all shadow-xs active:scale-95"
            title={t('help.title')}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('header.helpBtn')}</span>
          </button>
        </div>
      </div>

      {/* Modal Editar Nombre del Team */}
      <ConfirmModal
        isOpen={showEditTeamModal}
        title={t('header.editTeamTitle')}
        message={t('header.editTeamMsg')}
        confirmText={t('save')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        hasInput={true}
        inputLabel={t('header.teamNameLabel')}
        inputValue={teamNameInput}
        onInputChange={setTeamNameInput}
        onConfirm={handleConfirmEditTeam}
        onCancel={() => setShowEditTeamModal(false)}
        inputTestId="modal-form-input"
      />

      {/* Modal Editar Cronómetro */}
      <ConfirmModal
        isOpen={showEditTimerModal}
        title={t('header.editTimerTitle')}
        message={t('header.editTimerMsg')}
        confirmText={t('save')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        hasInput={true}
        inputType="number"
        inputLabel={t('header.secondsLabel')}
        inputValue={timerInput}
        onInputChange={setTimerInput}
        onConfirm={handleConfirmEditTimer}
        onCancel={() => setShowEditTimerModal(false)}
        inputTestId="modal-timer-seconds-input"
      />

      {/* Modal de Ayuda sobre Reunión Scrum */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </header>
  );
}
