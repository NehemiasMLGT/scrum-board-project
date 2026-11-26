import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  User,
  Hash
} from 'lucide-react';
import TaskModal from './TaskModal';
import ConfirmModal from '../Modal/ConfirmModal';
import { useI18n } from '../../i18n/I18nContext';

export default function CenterPanel({
  columns = [],
  members = [],
  onCreateTask,
  onUpdateTask,
  onMoveTask,
  onDeleteTask
}) {
  const { t } = useI18n();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColIdForNewTask, setDefaultColIdForNewTask] = useState(null);

  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null); // { taskId, sourceColId, sourceIndex }
  const [dragOverColId, setDragOverColId] = useState(null);

  // Drag & Drop Handlers
  const handleDragStart = (e, task, colId, index) => {
    const payload = { taskId: task.id, sourceColId: colId, sourceIndex: index };
    setDraggedItem(payload);
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e, targetColId, dropPosition = null) => {
    e.preventDefault();
    setDragOverColId(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      const data = dataStr ? JSON.parse(dataStr) : draggedItem;
      if (!data || !data.taskId) return;

      const targetCol = columns.find((c) => c.id === targetColId);
      const newPos = dropPosition !== null ? dropPosition : (targetCol?.tasks?.length || 0);

      onMoveTask(data.taskId, targetColId, newPos);
    } catch (err) {
      console.error('Error during drop:', err);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleOpenCreateTask = (colId = null) => {
    setEditingTask(null);
    setDefaultColIdForNewTask(colId || columns[0]?.id);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTaskForm = (taskData) => {
    if (taskData.id) {
      onUpdateTask(taskData.id, taskData);
    } else {
      onCreateTask(taskData);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  return (
    <main
      data-testid="center-panel-container"
      className="w-[80%] flex-1 h-[calc(100vh-20vh)] max-h-[calc(100vh-140px)] bg-slate-100 flex flex-col overflow-hidden select-none"
    >
      {/* Barra de Control Superior del Panel Central: Botón Nueva Tarea */}
      <div className="h-12 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Scrum Board
        </div>

        <button
          type="button"
          data-testid="btn-create-task"
          onClick={() => handleOpenCreateTask()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all active:scale-98 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t('centerPanel.newTaskBtn')}</span>
        </button>
      </div>

      {/* Scrum Board Nativo (4 Columnas con Drag & Drop) */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div
          data-testid="scrum-board-container"
          className="h-full w-full grid grid-cols-4 gap-4 overflow-hidden"
        >
          {columns.map((col) => {
            const isOver = dragOverColId === col.id;

            return (
              <div
                key={col.id}
                data-testid={`board-column-${col.id}`}
                className="h-full flex flex-col bg-slate-200/70 rounded-2xl border border-slate-300/80 overflow-hidden shadow-xs"
              >
                {/* Cabecera de Columna */}
                <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0" />
                    <h3
                      data-testid={`column-title-${col.id}`}
                      className="font-extrabold text-sm text-slate-800 tracking-tight truncate"
                    >
                      {col.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      data-testid={`column-task-count-${col.id}`}
                      className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {col.tasks?.length || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenCreateTask(col.id)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                      title={t('centerPanel.newTaskBtn')}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Zona Drop de Tareas */}
                <div
                  data-testid={`column-drop-zone-${col.id}`}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={(e) => handleDragLeave(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`flex-1 p-3 overflow-y-auto space-y-3 transition-colors duration-150 ${
                    isOver
                      ? 'bg-blue-100/60 ring-2 ring-blue-500/50 ring-inset'
                      : 'bg-transparent'
                  }`}
                >
                  {col.tasks && col.tasks.length > 0 ? (
                    col.tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task, col.id, idx)}
                        data-testid={`task-card-${task.id}`}
                        className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 group select-none"
                      >
                        {/* Fila Superior: Título y Acciones */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4
                            data-testid={`task-title-${task.id}`}
                            className="text-xs font-bold text-slate-900 leading-snug line-clamp-2"
                          >
                            {task.title}
                          </h4>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              type="button"
                              data-testid={`btn-edit-task-${task.id}`}
                              onClick={() => handleOpenEditTask(task)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                              title={t('centerPanel.editTaskTooltip')}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              data-testid={`btn-delete-task-${task.id}`}
                              onClick={() => setDeleteConfirmTask(task)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                              title={t('centerPanel.deleteTaskTooltip')}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Descripción */}
                        {task.description && (
                          <p
                            data-testid={`task-description-${task.id}`}
                            className="text-[11px] text-slate-500 line-clamp-2 mb-3 font-normal"
                          >
                            {task.description}
                          </p>
                        )}

                        {/* Fila Inferior: Asignado y Story Points */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          {/* Miembro Asignado */}
                          <div
                            data-testid={`task-assignee-${task.id}`}
                            className="flex items-center gap-1.5 text-slate-600 font-medium truncate max-w-[70%]"
                            title={task.assigned_member_name || t('unassigned')}
                          >
                            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                              <User className="w-3 h-3" />
                            </div>
                            <span className="truncate">
                              {task.assigned_member_name || t('unassigned')}
                            </span>
                          </div>

                          {/* Story Points */}
                          <span
                            data-testid={`task-points-${task.id}`}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 font-bold rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px]"
                            title={t('centerPanel.taskPoints')}
                          >
                            <Hash className="w-2.5 h-2.5 text-slate-400" />
                            {task.story_points ?? 0} {t('pts')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 text-xs italic">
                      {t('centerPanel.dropZoneEmpty')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Crear / Editar Tarea */}
      <TaskModal
        isOpen={isTaskModalOpen}
        task={editingTask}
        columns={columns}
        members={members}
        defaultColumnId={defaultColIdForNewTask}
        onSave={handleSaveTaskForm}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
      />

      {/* Modal Confirmar Eliminar Tarea */}
      <ConfirmModal
        isOpen={!!deleteConfirmTask}
        title={t('centerPanel.deleteTaskTitle')}
        message={t('centerPanel.deleteTaskMsg', { title: deleteConfirmTask?.title || '' })}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        confirmVariant="danger"
        onConfirm={() => {
          if (deleteConfirmTask) {
            onDeleteTask(deleteConfirmTask.id);
            setDeleteConfirmTask(null);
          }
        }}
        onCancel={() => setDeleteConfirmTask(null)}
      />
    </main>
  );
}
