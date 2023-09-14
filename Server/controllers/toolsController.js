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

exports.getTaskTools = async (req, res) => {
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
      'SELECT * FROM tasks_tools JOIN tools ON tasks_tools.tool_id = tools.tool_id WHERE task_id = $1;',
      [taskID]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task tools' });
  }
};

exports.deleteTaskTool = async (req, res) => {
  try {
    const { taskId, tool_id } = req.body;
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
      `DELETE FROM tasks_tools WHERE task_id = $1 AND tool_id = $2 RETURNING *;`,
      [taskId, tool_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task tools' });
  }
};

exports.addTaskTools = async (req, res) => {
  try {
    const { taskId, tool_ids } = req.body;
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
      text: `INSERT INTO tasks_tools (task_id, tool_id) VALUES ${tool_ids
        .map((_, i) => `($1, $${i + 2})`)
        .join(', ')} RETURNING *;`,
      values: [taskId, ...tool_ids],
    };
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding task tools' });
  }
};

exports.getTools = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query('SELECT * FROM tools;');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving tools' });
  }
};

exports.addTools = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { tool_id, tool_name } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO tools (tool_id, tool_name) VALUES ($1, $2) RETURNING *',
      [tool_id, tool_name]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding tool' });
  }
};

exports.updateTools = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { tool_id, tool_name } = req.body;
    const { rows } = await pool.query(
      'UPDATE tools SET tool_name = $1 WHERE tool_id = $2 RETURNING *;',
      [tool_name, tool_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating tool' });
  }
};

exports.deleteTools = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { tool_id } = req.body;
    await pool.query('DELETE FROM tasks_tools WHERE tool_id = $1;', [tool_id]);
    const { rows } = await pool.query(
      'DELETE FROM tools WHERE tool_id = $1 RETURNING *;',
      [tool_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting tool' });
  }
};
