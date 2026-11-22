import { pool } from '../config/db.js';

export async function createTask(req, res, next) {
  try {
    const {
      column_id,
      title,
      description = null,
      assigned_member_id = null,
      story_points = 0
    } = req.body;

    if (!column_id || !title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'column_id y title son obligatorios' }
      });
    }

    // Verify column exists
    const [cols] = await pool.query('SELECT * FROM board_columns WHERE id = ?', [column_id]);
    if (cols.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Columna no encontrada' }
      });
    }

    // Calculate next position in column
    const [posRow] = await pool.query(
      'SELECT COALESCE(MAX(position), -1) AS max_pos FROM tasks WHERE column_id = ?',
      [column_id]
    );
    const nextPos = (posRow[0].max_pos ?? -1) + 1;

    const [result] = await pool.query(
      `INSERT INTO tasks (column_id, title, description, assigned_member_id, story_points, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [column_id, title.trim(), description, assigned_member_id || null, Number(story_points) || 0, nextPos]
    );

    const [createdTask] = await pool.query(
      `SELECT t.*, tm.name AS assigned_member_name
       FROM tasks t
       LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
       WHERE t.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: createdTask[0],
      message: 'Tarea creada exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, assigned_member_id, story_points } = req.body;

    const [tasks] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' }
      });
    }

    const current = tasks[0];
    const newTitle = title !== undefined ? title.trim() : current.title;
    const newDesc = description !== undefined ? description : current.description;
    const newAssignee = assigned_member_id !== undefined ? (assigned_member_id || null) : current.assigned_member_id;
    const newPoints = story_points !== undefined ? Number(story_points) : current.story_points;

    if (!newTitle) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El título no puede estar vacío' }
      });
    }

    await pool.query(
      `UPDATE tasks 
       SET title = ?, description = ?, assigned_member_id = ?, story_points = ?
       WHERE id = ?`,
      [newTitle, newDesc, newAssignee, newPoints, id]
    );

    const [updated] = await pool.query(
      `SELECT t.*, tm.name AS assigned_member_name
       FROM tasks t
       LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
       WHERE t.id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: updated[0],
      message: 'Tarea actualizada exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { target_column_id, new_position } = req.body;

    if (target_column_id === undefined || new_position === undefined) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'target_column_id y new_position son requeridos' }
      });
    }

    const targetColId = Number(target_column_id);
    const targetPos = Math.max(0, Number(new_position));

    await connection.beginTransaction();

    // Verify task exists
    const [tasks] = await connection.query('SELECT * FROM tasks WHERE id = ? FOR UPDATE', [id]);
    if (tasks.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' }
      });
    }

    const task = tasks[0];
    const sourceColId = task.column_id;
    const sourcePos = task.position;

    if (sourceColId === targetColId) {
      // Reordering within the same column
      if (sourcePos < targetPos) {
        await connection.query(
          `UPDATE tasks 
           SET position = position - 1 
           WHERE column_id = ? AND position > ? AND position <= ?`,
          [sourceColId, sourcePos, targetPos]
        );
      } else if (sourcePos > targetPos) {
        await connection.query(
          `UPDATE tasks 
           SET position = position + 1 
           WHERE column_id = ? AND position >= ? AND position < ?`,
          [sourceColId, targetPos, sourcePos]
        );
      }
      await connection.query(
        'UPDATE tasks SET position = ? WHERE id = ?',
        [targetPos, id]
      );
    } else {
      // Moving to a different column
      // 1. Close gap in source column
      await connection.query(
        'UPDATE tasks SET position = position - 1 WHERE column_id = ? AND position > ?',
        [sourceColId, sourcePos]
      );

      // 2. Open space in target column
      await connection.query(
        'UPDATE tasks SET position = position + 1 WHERE column_id = ? AND position >= ?',
        [targetColId, targetPos]
      );

      // 3. Move task to target column and position
      await connection.query(
        'UPDATE tasks SET column_id = ?, position = ? WHERE id = ?',
        [targetColId, targetPos, id]
      );
    }

    await connection.commit();

    const [updatedTask] = await pool.query(
      `SELECT t.*, tm.name AS assigned_member_name
       FROM tasks t
       LEFT JOIN team_members tm ON t.assigned_member_id = tm.id
       WHERE t.id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: updatedTask[0],
      message: 'Tarea movida exitosamente'
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}

export async function deleteTask(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [tasks] = await connection.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (tasks.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Tarea no encontrada' }
      });
    }

    const { column_id, position } = tasks[0];

    await connection.query('DELETE FROM tasks WHERE id = ?', [id]);

    // Close gap
    await connection.query(
      'UPDATE tasks SET position = position - 1 WHERE column_id = ? AND position > ?',
      [column_id, position]
    );

    await connection.commit();

    res.json({ success: true, message: 'Tarea eliminada exitosamente' });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}
