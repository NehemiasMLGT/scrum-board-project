import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  UserPlus,
  RotateCcw,
  Shuffle,
  Users,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import ConfirmModal from '../Modal/ConfirmModal';
import { useI18n } from '../../i18n/I18nContext';

export default function LeftPanel({
  teams = [],
  activeTeamId,
  onSelectTeam,
  presentationMode = 'alphabetical',
  onChangeMode,
  members = [],
  activeMemberId,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onResetMemberStatus,
  onResetAllMembers,
  onRandomizeOrder
}) {
  const { t } = useI18n();

  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null); // { x, y, member }
  const menuRef = useRef(null);

  // Modal States
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'reset', 'edit', 'delete', 'add', 'reset_all'
    member: null,
    inputValue: ''
  });

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('contextmenu', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
    };
  }, []);

  const handleMemberContextMenu = (e, member) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 180),
      member
    });
  };

  const openActionModal = (type, member = null) => {
    setContextMenu(null);
    if (type === 'reset') {
      setModalState({
        isOpen: true,
        type: 'reset',
        member,
        inputValue: ''
      });
    } else if (type === 'edit') {
      setModalState({
        isOpen: true,
        type: 'edit',
        member,
        inputValue: member.name
      });
    } else if (type === 'delete') {
      setModalState({
        isOpen: true,
        type: 'delete',
        member,
        inputValue: ''
      });
    } else if (type === 'add') {
      setModalState({
        isOpen: true,
        type: 'add',
        member: null,
        inputValue: ''
      });
    } else if (type === 'reset_all') {
      setModalState({
        isOpen: true,
        type: 'reset_all',
        member: null,
        inputValue: ''
      });
    }
  };

  const handleModalConfirm = () => {
    const { type, member, inputValue } = modalState;
    if (type === 'reset' && member) {
      onResetMemberStatus(member.id);
    } else if (type === 'edit' && member && inputValue.trim()) {
      onEditMember(member.id, inputValue.trim());
    } else if (type === 'delete' && member) {
      onDeleteMember(member.id);
    } else if (type === 'add' && inputValue.trim()) {
      onAddMember(inputValue.trim());
    } else if (type === 'reset_all') {
      onResetAllMembers();
    }
    setModalState({ isOpen: false, type: null, member: null, inputValue: '' });
  };

  return (
    <aside
      data-testid="left-panel-container"
      className="w-[20%] min-w-[260px] max-w-[320px] h-[calc(100vh-20vh)] max-h-[calc(100vh-140px)] bg-slate-50 border-r-2 border-slate-200 flex flex-col justify-between select-none"
    >
      {/* 1. Header de controles superiores (Selectores: Primero Modo, luego Equipo) */}
      <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
        {/* Selector de Modo (Alfabético / Random) - Primero */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
            {t('leftPanel.presentationMode')}
          </label>
          <select
            data-testid="presentation-mode-select"
            value={presentationMode}
            onChange={(e) => onChangeMode(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="alphabetical">{t('leftPanel.modeAlphabetical')}</option>
            <option value="random">{t('leftPanel.modeRandom')}</option>
          </select>
        </div>

        {/* Selector de Team - Segundo */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            {t('leftPanel.activeTeam')}
          </label>
          <select
            data-testid="team-select-dropdown"
            value={activeTeamId || ''}
            onChange={(e) => onSelectTeam(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            {teams.map((tItem) => (
              <option key={tItem.id} value={tItem.id}>
                {tItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Lista de Miembros con Iconos y Destacado del Turno */}
      <div
        data-testid="member-list-container"
        className="flex-1 overflow-y-auto p-3 space-y-1.5"
      >
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
          {t('leftPanel.membersCount')} ({members.length})
        </div>

        {members.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            {t('leftPanel.noMembers')}
          </div>
        ) : (
          members.map((member) => {
            const isActive = member.id === activeMemberId;

            return (
              <div
                key={member.id}
                data-testid={`member-item-${member.id}`}
                onContextMenu={(e) => handleMemberContextMenu(e, member)}
                title={t('leftPanel.rightClickHint')}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium cursor-context-menu transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-sm ring-2 ring-blue-500/30 font-semibold'
                    : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {/* Icono de Estado */}
                  {member.status === 'completed' && (
                    <CheckCircle2
                      data-testid={`member-status-check-${member.id}`}
                      className="w-5 h-5 text-emerald-600 flex-shrink-0"
                    />
                  )}
                  {member.status === 'skipped' && (
                    <XCircle
                      data-testid={`member-status-skip-${member.id}`}
                      className="w-5 h-5 text-rose-600 flex-shrink-0"
                    />
                  )}
                  {member.status === 'pending' && (
                    <Clock
                      data-testid={`member-status-clock-${member.id}`}
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-blue-600 animate-spin-slow' : 'text-slate-400'
                      }`}
                    />
                  )}

                  <span
                    data-testid={`member-name-${member.id}`}
                    className="truncate"
                  >
                    {member.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <span
                      data-testid={`member-active-indicator-${member.id}`}
                      className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-blue-600 text-white rounded-md shadow-xs"
                    >
                      {t('leftPanel.turnBadge')}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleMemberContextMenu(e, member)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 rounded transition-opacity"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Acciones Fijas al Pie (En este orden exacto) */}
      <div className="p-3 border-t border-slate-200 bg-white space-y-2">
        {/* Opción 1: Agregar nuevo miembro */}
        <button
          type="button"
          data-testid="btn-add-member"
          onClick={() => openActionModal('add')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('leftPanel.addMemberBtn')}</span>
        </button>

        {/* Opción 2: Reiniciar reunión */}
        <button
          type="button"
          data-testid="btn-reset-all-members"
          onClick={() => openActionModal('reset_all')}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide transition-all active:scale-98"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>{t('leftPanel.restartMeetingBtn')}</span>
        </button>

        {/* Opción 3: Reordenar aleatoriamente */}
        <button
          type="button"
          data-testid="btn-randomize-members"
          onClick={onRandomizeOrder}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide transition-all active:scale-98"
        >
          <Shuffle className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t('leftPanel.randomizeBtn')}</span>
        </button>
      </div>

      {/* Menú Contextual (Clic Derecho en Miembro) */}
      {contextMenu && (
        <div
          ref={menuRef}
          data-testid="member-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            {contextMenu.member.name}
          </div>

          <button
            type="button"
            data-testid="context-menu-opt-reset"
            onClick={() => openActionModal('reset', contextMenu.member)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 font-medium text-slate-700 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('leftPanel.menuReset')}</span>
          </button>

          <button
            type="button"
            data-testid="context-menu-opt-edit"
            onClick={() => openActionModal('edit', contextMenu.member)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 font-medium text-slate-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('leftPanel.menuEdit')}</span>
          </button>

          <button
            type="button"
            data-testid="context-menu-opt-delete"
            onClick={() => openActionModal('delete', contextMenu.member)}
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-rose-50 text-rose-600 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>{t('leftPanel.menuDelete')}</span>
          </button>
        </div>
      )}

      {/* Modales de Confirmación */}
      {/* 1. Modal Restablecer a Reloj */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'reset'}
        title={t('leftPanel.resetMemberTitle')}
        message={t('leftPanel.resetMemberMsg', { name: modalState.member?.name || '' })}
        confirmText={t('leftPanel.resetMemberConfirm')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        onConfirm={handleModalConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null, member: null, inputValue: '' })}
      />

      {/* 2. Modal Editar Miembro */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'edit'}
        title={t('leftPanel.editMemberTitle')}
        message={t('leftPanel.editMemberMsg')}
        confirmText={t('save')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        hasInput={true}
        inputLabel={t('leftPanel.memberNameLabel')}
        inputValue={modalState.inputValue}
        onInputChange={(val) => setModalState((prev) => ({ ...prev, inputValue: val }))}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null, member: null, inputValue: '' })}
      />

      {/* 3. Modal Eliminar Miembro */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'delete'}
        title={t('leftPanel.deleteMemberTitle')}
        message={t('leftPanel.deleteMemberMsg', { name: modalState.member?.name || '' })}
        confirmText={t('leftPanel.deleteMemberConfirm')}
        cancelText={t('cancel')}
        confirmVariant="danger"
        onConfirm={handleModalConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null, member: null, inputValue: '' })}
      />

      {/* 4. Modal Agregar Nuevo Miembro */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'add'}
        title={t('leftPanel.addMemberTitle')}
        message={t('leftPanel.addMemberMsg')}
        confirmText={t('add')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        hasInput={true}
        inputLabel={t('leftPanel.memberNameLabel')}
        inputValue={modalState.inputValue}
        onInputChange={(val) => setModalState((prev) => ({ ...prev, inputValue: val }))}
        onConfirm={handleModalConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null, member: null, inputValue: '' })}
      />

      {/* 5. Modal Reiniciar Reunión */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'reset_all'}
        title={t('leftPanel.restartMeetingTitle')}
        message={t('leftPanel.restartMeetingMsg')}
        confirmText={t('leftPanel.restartMeetingConfirm')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        onConfirm={handleModalConfirm}
        onCancel={() => setModalState({ isOpen: false, type: null, member: null, inputValue: '' })}
      />
    </aside>
  );
}
