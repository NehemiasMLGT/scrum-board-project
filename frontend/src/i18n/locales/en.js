export default {
  // Common / Buttons
  yes: 'Yes',
  no: 'No',
  cancel: 'Cancel',
  save: 'Save',
  saveChanges: 'Save Changes',
  confirm: 'Confirm',
  delete: 'Delete',
  edit: 'Edit',
  add: 'Add',
  close: 'Close',
  pts: 'pts',
  unassigned: 'Unassigned',
  loading: 'Loading...',

  // Header
  header: {
    loadingTeam: 'Loading Team...',
    editTeamTooltip: 'Right-click to edit Team name',
    addTeamBtn: 'Add Team',
    timeRemaining: 'Time remaining',
    play: 'Play',
    pause: 'Pause',
    skip: 'Skip',
    editTeamTitle: 'Edit Team Name',
    editTeamMsg: 'Do you want to save the new name for this team?',
    teamNameLabel: 'Team Name',
    editTimerTitle: 'Edit Timer Duration',
    editTimerMsg: 'Do you want to set the turn duration (in seconds) for this team?',
    secondsLabel: 'Seconds per turn',
    helpBtn: 'Help'
  },

  // Help Modal
  help: {
    title: 'How to Run a Scrum Daily Stand-up',
    subtitle: 'Best practices for agile and effective team meetings',
    whatIsStandupTitle: 'The Stand-up Meeting Concept',
    whatIsStandupDesc: 'The Daily Scrum is a short, time-boxed meeting (typically 15 minutes) designed for the development team to synchronize activities and plan the next 24 hours. It is traditionally held standing up to keep it energetic and concise.',
    threeQuestionsTitle: 'The 3 Core Questions',
    threeQuestionsIntro: 'During their turn, each team member briefly answers three fundamental questions:',
    q1Title: '1. What did I work on yesterday?',
    q1Desc: 'Focus on completed tasks or progress that helps the team achieve the Sprint Goal.',
    q2Title: '2. What will I work on today?',
    q2Desc: 'State the specific commitment and tasks planned for today.',
    q3Title: '3. Are there any blockers or impediments?',
    q3Desc: 'Mention anything slowing you down or blocking progress so the Scrum Master and team can assist afterward.',
    rulesTitle: 'Key Meeting Rules',
    rule1: 'Keep it short: Stick strictly to the timer (1 to 2 minutes per person).',
    rule2: 'No deep discussions: Technical debates and side topics should be taken offline after the stand-up.',
    rule3: 'Team focus: Everyone stays present and engaged while teammates present.',
    gotItBtn: 'Understood, back to meeting'
  },

  // Left Panel
  leftPanel: {
    presentationMode: 'Presentation Mode',
    modeAlphabetical: 'Alphabetical (A-Z)',
    modeRandom: 'Random',
    activeTeam: 'Active Team',
    membersCount: 'Members',
    noMembers: 'No members registered in this team.',
    turnBadge: 'Turn',
    rightClickHint: 'Right-click for options (Reset, Edit, Delete)',
    addMemberBtn: '1. Add new member',
    restartMeetingBtn: '2. Restart meeting',
    randomizeBtn: '3. Shuffle randomly',
    // Context Menu
    menuReset: 'Reset to Clock',
    menuEdit: 'Edit',
    menuDelete: 'Delete',
    // Modals
    resetMemberTitle: 'Reset to Clock',
    resetMemberMsg: 'Do you want to reset the status of "{name}" to Clock (pending)?',
    resetMemberConfirm: 'Yes, reset',
    editMemberTitle: 'Edit Member',
    editMemberMsg: 'Do you want to save the new name for this member?',
    memberNameLabel: 'Member full name',
    deleteMemberTitle: 'Delete Member',
    deleteMemberMsg: 'Are you sure you want to remove "{name}" from this team? This action cannot be undone.',
    deleteMemberConfirm: 'Yes, delete',
    addMemberTitle: 'Add New Member',
    addMemberMsg: 'Enter the name of the new member for the active team:',
    addMemberConfirm: 'Yes, add',
    restartMeetingTitle: 'Restart Meeting',
    restartMeetingMsg: 'Do you want to restart the meeting? All team members will return to Clock (pending) and the turn will start with the first member.',
    restartMeetingConfirm: 'Yes, restart meeting'
  },

  // Center Panel & Tasks
  centerPanel: {
    newTaskBtn: 'New Task',
    dropZoneEmpty: 'Drag a task here',
    taskTitle: 'Task title',
    taskDesc: 'Description',
    taskAssignee: 'Assignee',
    taskPoints: 'Story points',
    editTaskTooltip: 'Edit task',
    deleteTaskTooltip: 'Delete task',
    deleteTaskTitle: 'Delete Task',
    deleteTaskMsg: 'Are you sure you want to delete the task "{title}"?'
  },

  // Task Modal
  taskModal: {
    createTitle: 'Create New Task',
    editTitle: 'Edit Task',
    titleLabel: 'Task Title *',
    titlePlaceholder: 'e.g. Implement SSO authentication...',
    descLabel: 'Description',
    descPlaceholder: 'Details, acceptance criteria, links...',
    columnLabel: 'Column',
    pointsLabel: 'Story Points (Fibonacci)',
    assigneeLabel: 'Assigned Member',
    unassignedOption: '-- Unassigned --',
    submitCreate: 'Create Task',
    submitEdit: 'Save Changes'
  },

  // Create Team Modal
  createTeamModal: {
    title: 'Create New Team',
    message: 'A new team will be created with its 4 canonical default columns (To Do, In Progress, Code Review, Done).',
    nameLabel: 'New team name *',
    confirmBtn: 'Yes, create team'
  },

  // Toasts
  toasts: {
    teamUpdated: 'Team name updated',
    timerUpdated: 'Duration set to {seconds} seconds',
    teamCreated: 'Team "{name}" created with 4 default columns',
    memberAdded: 'Member "{name}" added',
    memberUpdated: 'Member updated',
    memberDeleted: 'Member deleted',
    memberReset: 'Member reset to Clock (pending)',
    meetingRestarted: 'Meeting restarted. All members in Clock.',
    taskCreated: 'Task "{title}" created',
    taskUpdated: 'Task updated',
    taskDeleted: 'Task deleted',
    taskMoveError: 'Failed to move task. Reverted to previous order.',
    turnCompleted: 'Turn completed. Next: {name}',
    roundFinished: 'Meeting round finished! All members have presented.',
    turnSkipped: 'Turn skipped. Next: {name}',
    lastTurnSkipped: 'Last member skipped. Meeting round finished!',
    noPendingToSkip: 'No active member in turn to skip',
    noPendingToStart: 'No pending members. Restart meeting to begin a round.',
    modeChanged: 'Mode: {mode}. Turn: {name}',
    modeChangedAllDone: 'Mode: {mode}. All members already presented (no active turn).'
  }
};
