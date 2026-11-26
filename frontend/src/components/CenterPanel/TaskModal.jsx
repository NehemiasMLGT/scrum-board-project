import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export default function TaskModal({
  isOpen,
  task = null, // null if creating, task object if editing
  columns = [],
  members = [],
  defaultColumnId = null,
  onSave,
  onClose
}) {
  const { t } = useI18n();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumnId || '');
  const [assignedMemberId, setAssignedMemberId] = useState('');
  const [storyPoints, setStoryPoints] = useState(1);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setColumnId(task.column_id || defaultColumnId || (columns[0]?.id || ''));
      setAssignedMemberId(task.assigned_member_id ? String(task.assigned_member_id) : '');
      setStoryPoints(task.story_points ?? 1);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(defaultColumnId || (columns[0]?.id || ''));
      setAssignedMemberId('');
      setStoryPoints(1);
    }
  }, [task, defaultColumnId, columns, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task?.id,
      title: title.trim(),
      description: description.trim() || null,
      column_id: Number(columnId),
      assigned_member_id: assignedMemberId ? Number(assignedMemberId) : null,
      story_points: Number(storyPoints) || 0
    });
  };

  return (
    <div
      data-testid="modal-dialog-container"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        data-testid="task-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3
            data-testid="modal-dialog-title"
            className="text-base font-bold text-slate-900"
          >
            {task ? t('taskModal.editTitle') : t('taskModal.createTitle')}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('taskModal.titleLabel')}
            </label>
            <input
              type="text"
              required
              data-testid="task-input-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('taskModal.titlePlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('taskModal.descLabel')}
            </label>
            <textarea
              rows={3}
              data-testid="task-input-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('taskModal.descPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Columna */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('taskModal.columnLabel')}
              </label>
              <select
                data-testid="task-input-column"
                value={columnId}
                disabled={!!task}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-60"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Story Points */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('taskModal.pointsLabel')}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                data-testid="task-input-points"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Miembro Asignado */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('taskModal.assigneeLabel')}
            </label>
            <select
              data-testid="task-input-assignee"
              value={assignedMemberId}
              onChange={(e) => setAssignedMemberId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">{t('taskModal.unassignedOption')}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              data-testid="task-cancel-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              data-testid="task-submit-btn"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow hover:shadow-md transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>{task ? t('taskModal.submitEdit') : t('taskModal.submitCreate')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
