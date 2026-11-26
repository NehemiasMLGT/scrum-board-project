export default {
  // Common / Buttons
  yes: 'Ja',
  no: 'Nein',
  cancel: 'Abbrechen',
  save: 'Speichern',
  saveChanges: 'Änderungen speichern',
  confirm: 'Bestätigen',
  delete: 'Löschen',
  edit: 'Bearbeiten',
  add: 'Hinzufügen',
  close: 'Schließen',
  pts: 'Pkt',
  unassigned: 'Nicht zugewiesen',
  loading: 'Laden...',

  // Header
  header: {
    loadingTeam: 'Team wird geladen...',
    editTeamTooltip: 'Rechtsklick zum Bearbeiten des Teamnamens',
    addTeamBtn: 'Team hinzufügen',
    timeRemaining: 'Verbleibende Zeit',
    play: 'Start',
    pause: 'Pause',
    skip: 'Überspringen',
    editTeamTitle: 'Teamnamen bearbeiten',
    editTeamMsg: 'Möchten Sie den neuen Namen für dieses Team speichern?',
    teamNameLabel: 'Teamname',
    editTimerTitle: 'Timer-Dauer bearbeiten',
    editTimerMsg: 'Möchten Sie die Rundenzeit (in Sekunden) für dieses Team festlegen?',
    secondsLabel: 'Sekunden pro Runde',
    helpBtn: 'Hilfe'
  },

  // Help Modal
  help: {
    title: 'Ablauf eines Scrum Daily Stand-up Meetings',
    subtitle: 'Best Practices für agile und zielgerichtete Team-Meetings',
    whatIsStandupTitle: 'Das Stand-up-Konzept',
    whatIsStandupDesc: 'Das Daily Scrum ist ein kurzes, zeitlich begrenztes Meeting (typischerweise 15 Minuten), in dem das Entwicklungsteam seine Aktivitäten synchronisiert und die nächsten 24 Stunden plant. Es wird traditionell im Stehen abgehalten, um es dynamisch und fokussiert zu halten.',
    threeQuestionsTitle: 'Die 3 Kernfragen',
    threeQuestionsIntro: 'Während seines Zeitfensters beantwortet jedes Teammitglied kurz drei zentrale Fragen:',
    q1Title: '1. Woran habe ich gestern gearbeitet?',
    q1Desc: 'Fokus auf erledigte Aufgaben oder Fortschritte, die zum Sprint-Ziel beitragen.',
    q2Title: '2. Woran werde ich heute arbeiten?',
    q2Desc: 'Konkrete Verpflichtung und geplante Aufgaben für den heutigen Tag.',
    q3Title: '3. Welche Hindernisse oder Blockaden gibt es?',
    q3Desc: 'Erwähnung von Problemen oder Blockaden, damit der Scrum Master und das Team im Anschluss unterstützen können.',
    rulesTitle: 'Wichtige Spielregeln',
    rule1: 'Halten Sie sich kurz: Beachten Sie strikt den Timer (1 bis 2 Minuten pro Person).',
    rule2: 'Keine Detaildiskussionen: Ausführliche technische Debatten gehören in ein Anschlussgespräch.',
    rule3: 'Teamfokus: Alle hören aufmerksam zu, während eine Kollegin oder ein Kollege vorträgt.',
    gotItBtn: 'Verstanden, zurück zum Meeting'
  },

  // Left Panel
  leftPanel: {
    presentationMode: 'Präsentationsmodus',
    modeAlphabetical: 'Alphabetisch (A-Z)',
    modeRandom: 'Zufällig (Random)',
    activeTeam: 'Aktives Team',
    membersCount: 'Mitglieder',
    noMembers: 'Keine Mitglieder in diesem Team registriert.',
    turnBadge: 'Dran',
    rightClickHint: 'Rechtsklick für Optionen (Zurücksetzen, Bearbeiten, Löschen)',
    addMemberBtn: '1. Mitglied hinzufügen',
    restartMeetingBtn: '2. Meeting neu starten',
    randomizeBtn: '3. Zufällig neu ordnen',
    // Context Menu
    menuReset: 'Auf Uhr zurücksetzen',
    menuEdit: 'Bearbeiten',
    menuDelete: 'Löschen',
    // Modals
    resetMemberTitle: 'Auf Uhr zurücksetzen',
    resetMemberMsg: 'Möchten Sie den Status von "{name}" auf Uhr (ausstehend) zurücksetzen?',
    resetMemberConfirm: 'Ja, zurücksetzen',
    editMemberTitle: 'Mitglied bearbeiten',
    editMemberMsg: 'Möchten Sie den neuen Namen für dieses Mitglied speichern?',
    memberNameLabel: 'Vollständiger Name des Mitglieds',
    deleteMemberTitle: 'Mitglied löschen',
    deleteMemberMsg: 'Sind Sie sicher, dass Sie "{name}" aus diesem Team entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteMemberConfirm: 'Ja, löschen',
    addMemberTitle: 'Neues Mitglied hinzufügen',
    addMemberMsg: 'Geben Sie den Namen des neuen Mitglieds für das aktive Team ein:',
    addMemberConfirm: 'Ja, hinzufügen',
    restartMeetingTitle: 'Meeting neu starten',
    restartMeetingMsg: 'Möchten Sie das Meeting neu starten? Alle Mitglieder werden auf Uhr (ausstehend) zurückgesetzt und die Runde beginnt von vorn.',
    restartMeetingConfirm: 'Ja, Meeting neu starten'
  },

  // Center Panel & Tasks
  centerPanel: {
    newTaskBtn: 'Neue Aufgabe',
    dropZoneEmpty: 'Aufgabe hierher ziehen',
    taskTitle: 'Aufgabentitel',
    taskDesc: 'Beschreibung',
    taskAssignee: 'Zugewiesen an',
    taskPoints: 'Story Points',
    editTaskTooltip: 'Aufgabe bearbeiten',
    deleteTaskTooltip: 'Aufgabe löschen',
    deleteTaskTitle: 'Aufgabe löschen',
    deleteTaskMsg: 'Sind Sie sicher, dass Sie die Aufgabe "{title}" löschen möchten?'
  },

  // Task Modal
  taskModal: {
    createTitle: 'Neue Aufgabe erstellen',
    editTitle: 'Aufgabe bearbeiten',
    titleLabel: 'Aufgabentitel *',
    titlePlaceholder: 'z.B. SSO-Authentifizierung implementieren...',
    descLabel: 'Beschreibung',
    descPlaceholder: 'Details, Akzeptanzkriterien, Links...',
    columnLabel: 'Spalte',
    pointsLabel: 'Story Points (Fibonacci)',
    assigneeLabel: 'Zugewiesenes Mitglied',
    unassignedOption: '-- Nicht zugewiesen --',
    submitCreate: 'Aufgabe erstellen',
    submitEdit: 'Änderungen speichern'
  },

  // Create Team Modal
  createTeamModal: {
    title: 'Neues Team erstellen',
    message: 'Ein neues Team wird mit seinen 4 kanonischen Standardspalten erstellt (To Do, In Progress, Code Review, Done).',
    nameLabel: 'Neuer Teamname *',
    confirmBtn: 'Ja, Team erstellen'
  },

  // Toasts
  toasts: {
    teamUpdated: 'Teamname aktualisiert',
    timerUpdated: 'Dauer auf {seconds} Sekunden festgelegt',
    teamCreated: 'Team "{name}" mit 4 Standardspalten erstellt',
    memberAdded: 'Mitglied "{name}" hinzugefügt',
    memberUpdated: 'Mitglied aktualisiert',
    memberDeleted: 'Mitglied gelöscht',
    memberReset: 'Mitglied auf Uhr (ausstehend) zurückgesetzt',
    meetingRestarted: 'Meeting neu gestartet. Alle Mitglieder auf Uhr.',
    taskCreated: 'Aufgabe "{title}" erstellt',
    taskUpdated: 'Aufgabe aktualisiert',
    taskDeleted: 'Aufgabe gelöscht',
    taskMoveError: 'Aufgabe konnte nicht verschoben werden. Vorherige Reihenfolge wiederhergestellt.',
    turnCompleted: 'Runde abgeschlossen. Nächste(r): {name}',
    roundFinished: 'Meeting-Runde beendet! Alle Mitglieder haben vorgetragen.',
    turnSkipped: 'Übersprungen. Nächste(r): {name}',
    lastTurnSkipped: 'Letztes Mitglied übersprungen. Meeting-Runde beendet!',
    noPendingToSkip: 'Kein aktives Mitglied an der Reihe zum Überspringen',
    noPendingToStart: 'Keine ausstehenden Mitglieder. Starten Sie das Meeting neu.',
    modeChanged: 'Modus: {mode}. Dran: {name}',
    modeChangedAllDone: 'Modus: {mode}. Alle Mitglieder haben bereits vorgetragen.'
  }
};
