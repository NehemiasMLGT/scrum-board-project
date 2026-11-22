import { pool } from '../config/db.js';

export async function addMemberToTeam(req, res, next) {
  try {
    const { teamId } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El nombre del miembro es obligatorio' }
      });
    }

    // Verify team exists
    const [teams] = await pool.query('SELECT * FROM teams WHERE id = ?', [teamId]);
    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Team no encontrado' }
      });
    }

    // Get max sort_order
    const [orderRow] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM team_members WHERE team_id = ?',
      [teamId]
    );
    const nextOrder = (orderRow[0].max_order || 0) + 1;

    const [result] = await pool.query(
      'INSERT INTO team_members (team_id, name, status, sort_order) VALUES (?, ?, ?, ?)',
      [teamId, name.trim(), 'pending', nextOrder]
    );

    const [newMember] = await pool.query('SELECT * FROM team_members WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      data: newMember[0],
      message: 'Miembro agregado exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMember(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'El nombre no puede estar vacío' }
      });
    }

    const [result] = await pool.query(
      'UPDATE team_members SET name = ? WHERE id = ?',
      [name.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Miembro no encontrado' }
      });
    }

    const [updated] = await pool.query('SELECT * FROM team_members WHERE id = ?', [id]);
    res.json({
      success: true,
      data: updated[0],
      message: 'Nombre de miembro actualizado exitosamente'
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMember(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Miembro no encontrado' }
      });
    }
    res.json({ success: true, message: 'Miembro eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
}

export async function updateMemberStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'completed', 'skipped'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: `Estado inválido. Opciones: ${validStatuses.join(', ')}` }
      });
    }

    const [result] = await pool.query(
      'UPDATE team_members SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Miembro no encontrado' }
      });
    }

    const [updated] = await pool.query('SELECT * FROM team_members WHERE id = ?', [id]);
    res.json({
      success: true,
      data: updated[0],
      message: `Estado actualizado a ${status}`
    });
  } catch (err) {
    next(err);
  }
}

export async function resetAllMembersStatus(req, res, next) {
  try {
    const { teamId } = req.params;
    await pool.query(
      'UPDATE team_members SET status = ? WHERE team_id = ?',
      ['pending', teamId]
    );

    const [members] = await pool.query(
      'SELECT * FROM team_members WHERE team_id = ? ORDER BY sort_order ASC, name ASC',
      [teamId]
    );

    res.json({
      success: true,
      data: members,
      message: 'Todos los miembros han sido restablecidos a Reloj (pending)'
    });
  } catch (err) {
    next(err);
  }
}

export async function reorderMembers(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { teamId } = req.params;
    const { mode = 'random' } = req.body; // 'alphabetical' o 'random'

    const [members] = await connection.query(
      'SELECT * FROM team_members WHERE team_id = ?',
      [teamId]
    );

    if (members.length === 0) {
      return res.json({ success: true, data: [], message: 'No hay miembros para ordenar' });
    }

    let orderedList = [...members];

    if (mode === 'alphabetical') {
      orderedList.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    } else {
      // Fisher-Yates shuffle
      for (let i = orderedList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [orderedList[i], orderedList[j]] = [orderedList[j], orderedList[i]];
      }
    }

    await connection.beginTransaction();

    for (let index = 0; index < orderedList.length; index++) {
      const member = orderedList[index];
      await connection.query(
        'UPDATE team_members SET sort_order = ? WHERE id = ?',
        [index + 1, member.id]
      );
    }

    // Actualizar también presentation_mode en el team
    await connection.query(
      'UPDATE teams SET presentation_mode = ? WHERE id = ?',
      [mode, teamId]
    );

    await connection.commit();

    const [updatedMembers] = await pool.query(
      'SELECT * FROM team_members WHERE team_id = ? ORDER BY sort_order ASC',
      [teamId]
    );

    res.json({
      success: true,
      data: updatedMembers,
      presentation_mode: mode,
      message: `Miembros reordenados en modo ${mode}`
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
}
