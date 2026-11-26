export default {
  // Common / Buttons
  yes: 'Sí',
  no: 'No',
  cancel: 'Cancelar',
  save: 'Guardar',
  saveChanges: 'Guardar Cambios',
  confirm: 'Confirmar',
  delete: 'Eliminar',
  edit: 'Editar',
  add: 'Agregar',
  close: 'Cerrar',
  pts: 'pts',
  unassigned: 'Sin asignar',
  loading: 'Cargando...',

  // Header
  header: {
    loadingTeam: 'Cargando Team...',
    editTeamTooltip: 'Clic derecho para editar el nombre del Team',
    addTeamBtn: 'Agregar Team',
    timeRemaining: 'Tiempo restante',
    play: 'Play',
    pause: 'Pausa',
    skip: 'Skip',
    editTeamTitle: 'Editar Nombre del Team',
    editTeamMsg: '¿Deseas guardar el nuevo nombre para este equipo?',
    teamNameLabel: 'Nombre del Team',
    editTimerTitle: 'Editar Duración del Cronómetro',
    editTimerMsg: '¿Deseas fijar la duración por turno (en segundos) para este equipo?',
    secondsLabel: 'Segundos por turno',
    helpBtn: 'Ayuda'
  },

  // Help Modal
  help: {
    title: 'Cómo llevar una reunión Daily Stand-up de Scrum',
    subtitle: 'Buenas prácticas para reuniones de equipo ágiles y eficaces',
    whatIsStandupTitle: 'El concepto "Stand-up"',
    whatIsStandupDesc: 'El Daily Scrum es una reunión breve y acotada en el tiempo (típicamente 15 minutos) pensada para que el equipo de desarrollo sincronice actividades y planifique las próximas 24 horas. Tradicionalmente se realiza de pie ("stand-up") para mantenerla dinámica y concisa.',
    threeQuestionsTitle: 'Las 3 Preguntas Clave',
    threeQuestionsIntro: 'Durante su turno cronometrado, cada integrante responde de forma puntual a tres preguntas:',
    q1Title: '1. ¿En qué trabajé ayer?',
    q1Desc: 'Enfocado en las tareas completadas o avances que contribuyeron al Objetivo del Sprint.',
    q2Title: '2. ¿Qué haré hoy?',
    q2Desc: 'Compromiso específico de actividades y tareas planificadas para la jornada de hoy.',
    q3Title: '3. ¿Qué bloqueos o impedimentos tengo?',
    q3Desc: 'Mencionar cualquier obstáculo o traba técnica para que el Scrum Master y el equipo puedan coordinar ayuda tras la reunión.',
    rulesTitle: 'Reglas de Oro',
    rule1: 'Respeta el tiempo: Limítate al cronómetro asignado (1 a 2 minutos por integrante).',
    rule2: 'Sin discusiones profundas: Debates técnicos extensos se tratan fuera de la reunión ("parking lot").',
    rule3: 'Foco de equipo: Todos escuchan con atención mientras un compañero presenta.',
    gotItBtn: 'Entendido, volver a la reunión'
  },

  // Left Panel
  leftPanel: {
    presentationMode: 'Modo de Presentación',
    modeAlphabetical: 'Alfabético (A-Z)',
    modeRandom: 'Aleatorio (Random)',
    activeTeam: 'Equipo Activo',
    membersCount: 'Miembros',
    noMembers: 'Sin miembros registrados en este equipo.',
    turnBadge: 'Turno',
    rightClickHint: 'Clic derecho para opciones (Restablecer, Editar, Eliminar)',
    addMemberBtn: '1. Agregar nuevo miembro',
    restartMeetingBtn: '2. Reiniciar reunión',
    randomizeBtn: '3. Reordenar aleatoriamente',
    // Context Menu
    menuReset: 'Restablecer a Reloj',
    menuEdit: 'Editar',
    menuDelete: 'Eliminar',
    // Modals
    resetMemberTitle: 'Restablecer a Reloj',
    resetMemberMsg: '¿Deseas restablecer el estado de "{name}" a Reloj (pendiente)?',
    resetMemberConfirm: 'Sí, restablecer',
    editMemberTitle: 'Editar Miembro',
    editMemberMsg: '¿Deseas guardar el nuevo nombre del integrante?',
    memberNameLabel: 'Nombre del integrante',
    deleteMemberTitle: 'Eliminar Miembro',
    deleteMemberMsg: '¿Estás seguro de que deseas eliminar a "{name}" de este equipo? Esta acción no se puede deshacer.',
    deleteMemberConfirm: 'Sí, eliminar',
    addMemberTitle: 'Agregar Nuevo Miembro',
    addMemberMsg: 'Ingresa el nombre del nuevo integrante para el equipo activo:',
    addMemberConfirm: 'Sí, agregar',
    restartMeetingTitle: 'Reiniciar Reunión',
    restartMeetingMsg: '¿Deseas reiniciar la reunión? Todos los miembros del equipo volverán a Reloj (pendiente) y el turno comenzará con el primer integrante.',
    restartMeetingConfirm: 'Sí, reiniciar reunión'
  },

  // Center Panel & Tasks
  centerPanel: {
    newTaskBtn: 'Nueva Tarea',
    dropZoneEmpty: 'Arrastra una tarea aquí',
    taskTitle: 'Título de la tarea',
    taskDesc: 'Descripción',
    taskAssignee: 'Asignado',
    taskPoints: 'Story points',
    editTaskTooltip: 'Editar tarea',
    deleteTaskTooltip: 'Eliminar tarea',
    deleteTaskTitle: 'Eliminar Tarea',
    deleteTaskMsg: '¿Estás seguro de que deseas eliminar la tarea "{title}"?'
  },

  // Task Modal
  taskModal: {
    createTitle: 'Crear Nueva Tarea',
    editTitle: 'Editar Tarea',
    titleLabel: 'Título de la Tarea *',
    titlePlaceholder: 'Ej. Implementar login con SSO...',
    descLabel: 'Descripción',
    descPlaceholder: 'Detalles, criterios de aceptación, enlaces...',
    columnLabel: 'Columna',
    pointsLabel: 'Story Points (Fibonacci)',
    assigneeLabel: 'Miembro Encargado',
    unassignedOption: '-- Sin asignar --',
    submitCreate: 'Crear Tarea',
    submitEdit: 'Guardar Cambios'
  },

  // Create Team Modal
  createTeamModal: {
    title: 'Crear Nuevo Equipo',
    message: 'Se creará un nuevo equipo con sus 4 columnas canónicas por defecto (To Do, In Progress, Code Review, Done).',
    nameLabel: 'Nombre del nuevo equipo *',
    confirmBtn: 'Sí, crear equipo'
  },

  // Toasts
  toasts: {
    teamUpdated: 'Nombre del Team actualizado',
    timerUpdated: 'Duración configurada a {seconds} segundos',
    teamCreated: 'Equipo "{name}" creado con 4 columnas por defecto',
    memberAdded: 'Miembro "{name}" agregado',
    memberUpdated: 'Miembro actualizado',
    memberDeleted: 'Miembro eliminado',
    memberReset: 'Miembro restablecido a Reloj (pendiente)',
    meetingRestarted: 'Reunión reiniciada. Todos los miembros en Reloj.',
    taskCreated: 'Tarea "{title}" creada',
    taskUpdated: 'Tarea actualizada',
    taskDeleted: 'Tarea eliminada',
    taskMoveError: 'Fallo al mover la tarea. Se restauró el orden previo.',
    turnCompleted: 'Turno completado. Siguiente: {name}',
    roundFinished: '¡Ronda finalizada! Todos los miembros han presentado.',
    turnSkipped: 'Turno omitido. Siguiente: {name}',
    lastTurnSkipped: 'Último miembro omitido. ¡Ronda de reunión finalizada!',
    noPendingToSkip: 'No hay ningún miembro en turno para saltar',
    noPendingToStart: 'No hay miembros pendientes. Reinicia la reunión para comenzar.',
    modeChanged: 'Modo: {mode}. Turno: {name}',
    modeChangedAllDone: 'Modo: {mode}. Todos ya presentaron (sin turno activo).'
  }
};
