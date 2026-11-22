import { pool } from '../config/db.js';

export async function getAllTeams(req, res, next) {
  try {
    const [teams] = await pool.query(
      `SELECT t.*, 
        (SELECT COUNT(*) FROM team_members tm WHERE tm.team_id = t.id) AS members_count,
        (SELECT COUNT(*) FROM board_columns bc WHERE bc.team_id = t.id) AS columns_count
       FROM teams t 
       ORDER BY t.name ASC`
    );
    res.json({ success: true, data: teams });
  } catch (err) {
    next(err);
  }
}

export async function getTeamById(req, res, next) {
  try {
    const { id } = req.params;
    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team no encontrado' }
      });
    }
    const team = teams[0];

    // Get members
    const [members] = await pool.query(
      'SELECT * FROM team_members WHERE team_id = ? ORDER BY sort_order ASC, name ASC',
      [id]
    );

    // Get columns
    const [columns] = await pool.query(
      'SELECT * FROM board_columns WHERE team_id = ? ORDER BY position ASC',
      [id]
    );

    // Get tasks for this team's columns
    const columnIds = columns.map(c => c.id);
    let tasks = [];
    if (columnIds.length > 0) {
      const [tasksRows] = await pool.query(
        `SELECT t.*, tm.name AS assigned_member_name
         FROM tasks t
         LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
         WHERE t.column_id IN (?)
         ORDER BY t.position ASC`,
        [columnIds]
      );
      tasks = tasksRows;
    }

    // Attach tasks to respective columns
    const columnsWithTasks = columns.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.column_id === col.id)
    }));

    res.json({
      success: true,
      data: {
        ...team,
        members,
        columns: columnsWithTasks
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function createTeam(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      name,
      default_timer_seconds = 120,
      presentation_mode = 'alphabetical',
      use_external_board = false,
      external_board_url = null
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El nombre del Team es obligatorio' }
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO teams (name, default_timer_seconds, presentation_mode, use_external_board, external_board_url)
       VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), default_timer_seconds, presentation_mode, use_external_board, external_board_url]
    );

    const teamId = result.insertId;

    // Auto-crear las 4 columnas por defecto
    const defaultColumns = [
      { name: 'To Do', position: 1 },
      { name: 'In Progress', position: 2 },
      { name: 'Code Review', position: 3 },
      { name: 'Done', position: 4 }
    ];

    for (const col of defaultColumns) {
      await connection.query(
        'INSERT INTO board_columns (team_id, name, position) VALUES (?, ?, ?)',
        [teamId, col.name, col.position]
      );
    }

    await connection.commit();

    const [createdTeam] = await pool.query('SELECT * FROM teams WHERE id = ?', [teamId]);
    const [columns] = await pool.query('SELECT * FROM board_columns WHERE team_id = ? ORDER BY position ASC', [teamId]);

    res.status(201).json({
      success: true,
      data: {
        ...createdTeam[0],
        members: [],
        columns: columns.map(c => ({ ...c, tasks: [] }))
      },
      message: 'Team creado exitosamente con 4 columnas por defecto'
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

export async function updateTeam(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      default_timer_seconds,
      presentation_mode,
      use_external_board,
      external_board_url
    } = req.body;

    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team no encontrado' }
      });
    }

    const current = teams[0];
    const updatedName = name !== undefined ? name.trim() : current.name;
    const updatedTimer = default_timer_seconds !== undefined ? Number(default_timer_seconds) : current.default_timer_seconds;
    const updatedMode = presentation_mode !== undefined ? presentation_mode : current.presentation_mode;
    const updatedExternalBoard = use_external_board !== undefined ? Boolean(use_external_board) : current.use_external_board;
    const updatedUrl = external_board_url !== undefined ? external_board_url : current.external_board_url;

    if (!updatedName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El nombre del Team no puede quedar vacío' }
      });
    }

    await pool.query(
      `UPDATE teams 
       SET name = ?, default_timer_seconds = ?, presentation_mode = ?, use_external_board = ?, external_board_url = ?
       WHERE id = ?`,
      [updatedName, updatedTimer, updatedMode, updatedExternalBoard, updatedUrl, id]
    );

    const [updatedTeam] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
    res.json({
      success: true,
      data: updatedTeam[0],
      message: 'Team actualizado exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM teams WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team no encontrado' }
      });
    }
    res.json({ success: true, message: 'Team eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
}
