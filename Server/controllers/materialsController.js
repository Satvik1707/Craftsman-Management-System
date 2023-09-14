const { pool } = require('../config/db');
const checkAdminOrAssigned = async (userID, role, routeID) => {
  if (role === 'admin') {
    return true;
  }

  const { rows } = await pool.query(
    'SELECT * FROM routes WHERE employee_id = $1 AND route_id = $2',
    [userID, routeID]
  );

  const isAssigned = rows.length > 0;
  return isAssigned;
};
exports.getTaskMaterials = async (req, res) => {
  try {
    const { taskID } = req.params;
    const { rows: taskRows } = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskID]
    );
    const task = taskRows[0];

    if (
      !task ||
      !(await checkAdminOrAssigned(
        req.user.user_id,
        req.user.role,
        task.route_id
      ))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM tasks_materials JOIN materials ON tasks_materials.material_id = materials.material_id WHERE task_id = $1;',
      [taskID]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task materials' });
  }
};
exports.deleteTaskMaterial = async (req, res) => {
  try {
    const { taskId, material_id } = req.body;
    const { rows: taskRows } = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskId]
    );
    const task = taskRows[0];

    if (
      !task ||
      !(await checkAdminOrAssigned(
        req.user.user_id,
        req.user.role,
        task.route_id
      ))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query(
      `DELETE FROM tasks_materials WHERE task_id = $1 AND material_id = $2 RETURNING *;`,
      [taskId, material_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task materials' });
  }
};
exports.addTaskMaterials = async (req, res) => {
  try {
    const { taskId, material_ids } = req.body;
    const { rows: taskRows } = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskId]
    );
    const task = taskRows[0];

    if (
      !task ||
      !(await checkAdminOrAssigned(
        req.user.user_id,
        req.user.role,
        task.route_id
      ))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const query = {
      text: `INSERT INTO tasks_materials (task_id, material_id) VALUES ${material_ids
        .map((_, i) => `($1, $${i + 2})`)
        .join(', ')} RETURNING *;`,
      values: [taskId, ...material_ids],
    };

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding task materials' });
  }
};
exports.getMaterials = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query('SELECT * FROM materials;');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving materials' });
  }
};

exports.addMaterials = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { material_id, material_name } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO materials values ($1, $2) returning *;',
      [material_id, material_name]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding material' });
  }
};
exports.updateMaterials = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { material_id, material_name } = req.body;
    const { rows } = await pool.query(
      'UPDATE materials SET material_name = $1 WHERE material_id = $2 RETURNING *;',
      [material_name, material_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating material' });
  }
};
exports.deleteMaterials = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { material_id } = req.body;
    await pool.query('DELETE FROM tasks_materials WHERE material_id = $1;', [
      material_id,
    ]);
    const { rows } = await pool.query(
      'DELETE FROM materials WHERE material_id = $1 RETURNING *;',
      [material_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting material' });
  }
};
