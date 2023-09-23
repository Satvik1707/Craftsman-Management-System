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

exports.getTasks = async (req, res) => {
  try {
    const { routeId } = req.params;
    if (
      !(await checkAdminOrAssigned(req.user.user_id, req.user.role, routeId))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE route_id = $1',
      [routeId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { task_name, route_id, description, latitude, longitude, note } =
      req.body;

    const { rows } = await pool.query(
      "INSERT INTO tasks (task_name, route_id, status, description, latitude, longitude, note) VALUES ($1, $2, 'pending', $3, $4, $5, $6) RETURNING *",
      [task_name, route_id, description, latitude, longitude, note]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const { routeID, taskID } = req.params;

    if (
      !(await checkAdminOrAssigned(req.user.user_id, req.user.role, routeID))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE route_id = $1 AND task_id = $2',
      [routeID, taskID]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task' });
  }
};

exports.updateTask = async (req, res) => {
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

    const { task_name, status, description, latitude, longitude, note } =
      req.body;
    const { rows: updatedRows } = await pool.query(
      'UPDATE tasks SET task_name = $1, status = $2, description = $3, latitude = $4, longitude = $5, note = $6 WHERE task_id = $7 RETURNING *',
      [task_name, status, description, latitude, longitude, note, taskID]
    );

    res.json(updatedRows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { taskId } = req.params;

    // console.log(taskId);

    await pool.query(
      'UPDATE tasks_tools SET task_id = NULL WHERE task_id = $1;',
      [taskId]
    );
    await pool.query(
      'UPDATE tasks_materials SET task_id = NULL WHERE task_id = $1;',
      [taskId]
    );
    await pool.query(
      'UPDATE tasks_issues SET task_id = NULL WHERE task_id = $1;',
      [taskId]
    );
    const { rows: taskRows } = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskId]
    );
    const task = taskRows[0];

    // console.log((task));

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

    await pool.query('DELETE FROM tasks WHERE task_id = $1', [taskId]);
    res.status(204).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};
