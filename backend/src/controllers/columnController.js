import { pool } from '../config/db.js';

export async function getColumnsByTeam(req, res, next) {
  try {
    const { teamId } = req.params;
    const [columns] = await pool.query(
      'SELECT * FROM board_columns WHERE team_id = ? ORDER BY position ASC',
      [teamId]
    );

    if (columns.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const columnIds = columns.map(c => c.id);
    const [tasks] = await pool.query(
      `SELECT t.*, tm.name AS assigned_member_name
       FROM tasks t
       LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
       WHERE t.column_id IN (?)
       ORDER BY t.position ASC`,
      [columnIds]
    );

    const result = columns.map(col => ({
      ...col,
      tasks: tasks.filter(t => t.column_id === col.id)
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function createColumn(req, res, next) {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El nombre de la columna es obligatorio' }
      });
    }

    const [posRow] = await pool.query(
      'SELECT COALESCE(MAX(position), 0) AS max_pos FROM board_columns WHERE team_id = ?',
      [teamId]
    );
    const nextPos = (posRow[0].max_pos || 0) + 1;

    const [result] = await pool.query(
      'INSERT INTO board_columns (team_id, name, position) VALUES (?, ?, ?)',
      [teamId, name.trim(), nextPos]
    );

    const [newCol] = await pool.query('SELECT * FROM board_columns WHERE id = ?', [result.insertId]);
    res.status(201).json({
      success: true,
      data: { ...newCol[0], tasks: [] },
      message: 'Columna creada exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function updateColumn(req, res, next) {
  try {
    const { id } = req.params;
    const { name, position } = req.body;

    const [cols] = await pool.query('SELECT * FROM board_columns WHERE id = ?', [id]);
    if (cols.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Columna no encontrada' }
      });
    }

    const current = cols[0];
    const newName = name !== undefined ? name.trim() : current.name;
    const newPos = position !== undefined ? Number(position) : current.position;

    await pool.query(
      'UPDATE board_columns SET name = ?, position = ? WHERE id = ?',
      [newName, newPos, id]
    );

    const [updated] = await pool.query('SELECT * FROM board_columns WHERE id = ?', [id]);
    res.json({
      success: true,
      data: updated[0],
      message: 'Columna actualizada exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteColumn(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM board_columns WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Columna no encontrada' }
      });
    }
    res.json({ success: true, message: 'Columna eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
}
