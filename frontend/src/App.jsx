import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header/Header';
import LeftPanel from './components/LeftPanel/LeftPanel';
import CenterPanel from './components/CenterPanel/CenterPanel';
import ConfirmModal from './components/Modal/ConfirmModal';
import { api } from './api/client';
import { useI18n } from './i18n/I18nContext';

export default function App() {
  const { t } = useI18n();

  // Global States
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Turn & Timer States
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [initialSeconds, setInitialSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modal: Add New Team
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  // Notification Toast / Message
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial Load: Fetch all teams
  useEffect(() => {
    async function loadInitialTeams() {
      try {
        setIsLoading(true);
        const teamsData = await api.getTeams();
        setTeams(teamsData);
        if (teamsData.length > 0) {
          setActiveTeamId(teamsData[0].id);
        }
      } catch (err) {
        console.error('Error loading teams:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialTeams();
  }, []);

  // 2. Fetch Active Team Details when activeTeamId changes
  const loadTeamDetails = useCallback(async (teamId) => {
    if (!teamId) return;
    try {
      const data = await api.getTeam(teamId);
      setTeam(data);
      setMembers(data.members || []);
      setColumns(data.columns || []);

      const defSeconds = data.default_timer_seconds || 120;
      setInitialSeconds(defSeconds);
      setTimerSeconds(defSeconds);
      setIsTimerRunning(false);

      // Select active member: First pending member in order
      const firstPending = (data.members || []).find((m) => m.status === 'pending');
      setActiveMemberId(firstPending ? firstPending.id : null);
    } catch (err) {
      console.error('Error loading team details:', err);
    }
  }, []);

  useEffect(() => {
    if (activeTeamId) {
      loadTeamDetails(activeTeamId);
    }
  }, [activeTeamId, loadTeamDetails]);

  // Find next pending member in circular order starting after given member
  const getNextPendingMember = (currentMemberId, memberList = members) => {
    if (!memberList || memberList.length === 0) return null;
    const pendingList = memberList.filter((m) => m.status === 'pending');
    if (pendingList.length === 0) return null;

    const currentIndex = memberList.findIndex((m) => m.id === currentMemberId);
    if (currentIndex === -1) return pendingList[0];

    // Check after currentIndex
    for (let i = currentIndex + 1; i < memberList.length; i++) {
      if (memberList[i].status === 'pending') {
        return memberList[i];
      }
    }
    // Check from beginning up to currentIndex
    for (let i = 0; i <= currentIndex; i++) {
      if (memberList[i].status === 'pending') {
        return memberList[i];
      }
    }
    return null;
  };

  // 3. Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Timer expired (00:00)
            clearInterval(interval);
            handleTimerExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, activeMemberId, members, initialSeconds]);

  // Turn Flow Rule 1: Timer Hits 00:00
  const handleTimerExpired = async () => {
    setIsTimerRunning(false);
    if (!activeMemberId) return;

    try {
      // 1. Mark current member as 'completed'
      await api.updateMemberStatus(activeMemberId, 'completed');
      const updatedMembers = members.map((m) =>
        m.id === activeMemberId ? { ...m, status: 'completed' } : m
      );
      setMembers(updatedMembers);

      // 2. Find next pending member
      const nextPending = getNextPendingMember(activeMemberId, updatedMembers);
      if (nextPending) {
        setActiveMemberId(nextPending.id);
        setTimerSeconds(initialSeconds);
        showToast(t('toasts.turnCompleted', { name: nextPending.name }));
      } else {
        setActiveMemberId(null);
        showToast(t('toasts.roundFinished'));
      }
    } catch (err) {
      console.error('Error completing turn:', err);
    }
  };

  // Turn Flow Rule 2: Click on Skip Button
  const handleSkipTurn = async () => {
    if (!activeMemberId) {
      showToast(t('toasts.noPendingToSkip'));
      return;
    }

    setIsTimerRunning(false);

    try {
      // 1. Mark current member as 'skipped'
      await api.updateMemberStatus(activeMemberId, 'skipped');
      const updatedMembers = members.map((m) =>
        m.id === activeMemberId ? { ...m, status: 'skipped' } : m
      );
      setMembers(updatedMembers);

      // 2. Advance to next pending member
      const nextPending = getNextPendingMember(activeMemberId, updatedMembers);

      if (nextPending) {
        setActiveMemberId(nextPending.id);
        setTimerSeconds(initialSeconds);
        showToast(t('toasts.turnSkipped', { name: nextPending.name }));
      } else {
        setActiveMemberId(null);
        showToast(t('toasts.lastTurnSkipped'));
      }
    } catch (err) {
      console.error('Error skipping turn:', err);
    }
  };

  // Toggle Play / Pause
  const handleToggleTimer = () => {
    if (!isTimerRunning) {
      if (!activeMemberId) {
        const firstPending = members.find((m) => m.status === 'pending');
        if (firstPending) {
          setActiveMemberId(firstPending.id);
        } else {
          showToast(t('toasts.noPendingToStart'));
          return;
        }
      }
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
    }
  };

  // Header Actions
  const handleUpdateTeamName = async (newName) => {
    if (!team) return;
    try {
      const updated = await api.updateTeam(team.id, { name: newName });
      setTeam((prev) => ({ ...prev, name: updated.name }));
      setTeams((prev) => prev.map((tItem) => (tItem.id === team.id ? { ...tItem, name: updated.name } : tItem)));
      showToast(t('toasts.teamUpdated'));
    } catch (err) {
      console.error('Error updating team name:', err);
    }
  };

  const handleUpdateTimerSeconds = async (seconds) => {
    if (!team) return;
    try {
      await api.updateTeam(team.id, { default_timer_seconds: seconds });
      setInitialSeconds(seconds);
      setTimerSeconds(seconds);
      setIsTimerRunning(false);
      setTeam((prev) => ({ ...prev, default_timer_seconds: seconds }));
      showToast(t('toasts.timerUpdated', { seconds }));
    } catch (err) {
      console.error('Error updating timer duration:', err);
    }
  };

  const handleConfirmAddTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      const created = await api.createTeam({ name: newTeamName.trim() });
      setTeams((prev) => [...prev, created]);
      setActiveTeamId(created.id);
      setShowAddTeamModal(false);
      setNewTeamName('');
      showToast(t('toasts.teamCreated', { name: created.name }));
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  // Left Panel Actions
  const handleChangePresentationMode = async (mode) => {
    if (!team) return;
    try {
      const updatedMembers = await api.reorderMembers(team.id, mode);
      setMembers(updatedMembers);
      setTeam((prev) => ({ ...prev, presentation_mode: mode }));

      // Rule: Only pending members are reordered. If pending members remain, first pending gets turn.
      // If all completed or skipped, reorder occurs but no member gets the "Turn" badge.
      const firstPending = updatedMembers.find((m) => m.status === 'pending');
      const modeLabel = mode === 'alphabetical' ? t('leftPanel.modeAlphabetical') : t('leftPanel.modeRandom');

      if (firstPending) {
        setActiveMemberId(firstPending.id);
        setTimerSeconds(initialSeconds);
        setIsTimerRunning(false);
        showToast(t('toasts.modeChanged', { mode: modeLabel, name: firstPending.name }));
      } else {
        setActiveMemberId(null);
        setIsTimerRunning(false);
        showToast(t('toasts.modeChangedAllDone', { mode: modeLabel }));
      }
    } catch (err) {
      console.error('Error changing presentation mode:', err);
    }
  };

  const handleAddMember = async (name) => {
    if (!team) return;
    try {
      const created = await api.addMember(team.id, { name });
      setMembers((prev) => [...prev, created]);
      if (!activeMemberId) {
        setActiveMemberId(created.id);
      }
      showToast(t('toasts.memberAdded', { name: created.name }));
    } catch (err) {
      console.error('Error adding member:', err);
    }
  };

  const handleEditMember = async (memberId, newName) => {
    try {
      const updated = await api.updateMember(memberId, { name: newName });
      setMembers((prev) => prev.map((m) => (m.id === memberId ? updated : m)));
      setColumns((prevCols) =>
        prevCols.map((col) => ({
          ...col,
          tasks: col.tasks.map((taskItem) =>
            taskItem.assigned_member_id === memberId
              ? { ...taskItem, assigned_member_name: newName }
              : taskItem
          )
        }))
      );
      showToast(t('toasts.memberUpdated'));
    } catch (err) {
      console.error('Error editing member:', err);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await api.deleteMember(memberId);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      if (activeMemberId === memberId) {
        const remaining = members.filter((m) => m.id !== memberId);
        const next = remaining.find((m) => m.status === 'pending');
        setActiveMemberId(next ? next.id : null);
      }
      setColumns((prevCols) =>
        prevCols.map((col) => ({
          ...col,
          tasks: col.tasks.map((taskItem) =>
            taskItem.assigned_member_id === memberId
              ? { ...taskItem, assigned_member_id: null, assigned_member_name: null }
              : taskItem
          )
        }))
      );
      showToast(t('toasts.memberDeleted'));
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  const handleResetMemberStatus = async (memberId) => {
    try {
      const updated = await api.updateMemberStatus(memberId, 'pending');
      setMembers((prev) => prev.map((m) => (m.id === memberId ? updated : m)));
      if (!activeMemberId) {
        setActiveMemberId(memberId);
      }
      showToast(t('toasts.memberReset'));
    } catch (err) {
      console.error('Error resetting member status:', err);
    }
  };

  const handleResetAllMembers = async () => {
    if (!team) return;
    try {
      const updatedList = await api.resetMembersStatus(team.id);
      setMembers(updatedList);
      const firstPending = updatedList.find((m) => m.status === 'pending');
      setActiveMemberId(firstPending ? firstPending.id : null);
      setTimerSeconds(initialSeconds);
      setIsTimerRunning(false);
      showToast(t('toasts.meetingRestarted'));
    } catch (err) {
      console.error('Error restarting meeting:', err);
    }
  };

  const handleRandomizeOrder = () => {
    handleChangePresentationMode('random');
  };

  // Tasks Actions
  const handleCreateTask = async (taskData) => {
    try {
      const created = await api.createTask(taskData);
      setColumns((prevCols) =>
        prevCols.map((col) => {
          if (col.id === created.column_id) {
            return { ...col, tasks: [...col.tasks, created] };
          }
          return col;
        })
      );
      showToast(t('toasts.taskCreated', { title: created.title }));
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const updated = await api.updateTask(taskId, taskData);
      setColumns((prevCols) =>
        prevCols.map((col) => ({
          ...col,
          tasks: col.tasks.map((taskItem) => (taskItem.id === taskId ? updated : taskItem))
        }))
      );
      showToast(t('toasts.taskUpdated'));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Drag & Drop Task Movement with Optimistic Update
  const handleMoveTask = async (taskId, targetColumnId, newPosition) => {
    const previousColumns = JSON.parse(JSON.stringify(columns));

    let movedTask = null;
    let newColumns = columns.map((col) => {
      const filtered = col.tasks.filter((taskItem) => {
        if (taskItem.id === taskId) {
          movedTask = { ...taskItem, column_id: targetColumnId };
          return false;
        }
        return true;
      });
      return { ...col, tasks: filtered };
    });

    if (!movedTask) return;

    newColumns = newColumns.map((col) => {
      if (col.id === targetColumnId) {
        const tasksCopy = [...col.tasks];
        const insertIndex = Math.min(newPosition, tasksCopy.length);
        tasksCopy.splice(insertIndex, 0, movedTask);
        return {
          ...col,
          tasks: tasksCopy.map((taskItem, idx) => ({ ...taskItem, position: idx }))
        };
      }
      return {
        ...col,
        tasks: col.tasks.map((taskItem, idx) => ({ ...taskItem, position: idx }))
      };
    });

    setColumns(newColumns);

    try {
      await api.moveTask(taskId, targetColumnId, newPosition);
    } catch (err) {
      console.error('Error moving task, rolling back:', err);
      setColumns(previousColumns);
      showToast(t('toasts.taskMoveError'));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setColumns((prevCols) =>
        prevCols.map((col) => ({
          ...col,
          tasks: col.tasks.filter((taskItem) => taskItem.id !== taskId)
        }))
      );
      showToast(t('toasts.taskDeleted'));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-6 z-50 bg-slate-900/90 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-sm border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
          {toastMessage}
        </div>
      )}

      {/* 1. HEADER (20% Height) */}
      <Header
        team={team}
        timerSeconds={timerSeconds}
        initialSeconds={initialSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onSkipTurn={handleSkipTurn}
        onUpdateTeamName={handleUpdateTeamName}
        onUpdateTimerSeconds={handleUpdateTimerSeconds}
        onAddTeamClick={() => {
          setNewTeamName('');
          setShowAddTeamModal(true);
        }}
      />

      {/* 2. LOWER LAYOUT (80% Height): Left Panel (20% Width) + Center Panel (80% Width) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel (20% width) */}
        <LeftPanel
          teams={teams}
          activeTeamId={activeTeamId}
          onSelectTeam={setActiveTeamId}
          presentationMode={team?.presentation_mode || 'alphabetical'}
          onChangeMode={handleChangePresentationMode}
          members={members}
          activeMemberId={activeMemberId}
          onAddMember={handleAddMember}
          onEditMember={handleEditMember}
          onDeleteMember={handleDeleteMember}
          onResetMemberStatus={handleResetMemberStatus}
          onResetAllMembers={handleResetAllMembers}
          onRandomizeOrder={handleRandomizeOrder}
        />

        {/* Center Panel (80% width) - Exclusively Native Scrum Board */}
        <CenterPanel
          columns={columns}
          members={members}
          onCreateTask={handleCreateTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Modal Add New Team */}
      <ConfirmModal
        isOpen={showAddTeamModal}
        title={t('createTeamModal.title')}
        message={t('createTeamModal.message')}
        confirmText={t('createTeamModal.confirmBtn')}
        cancelText={t('cancel')}
        confirmVariant="primary"
        hasInput={true}
        inputLabel={t('createTeamModal.nameLabel')}
        inputValue={newTeamName}
        onInputChange={setNewTeamName}
        onConfirm={handleConfirmAddTeam}
        onCancel={() => setShowAddTeamModal(false)}
        inputTestId="modal-form-input"
      />
    </div>
  );
}
