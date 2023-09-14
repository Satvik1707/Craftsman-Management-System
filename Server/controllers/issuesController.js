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
exports.getTaskIssues = async (req, res) => {
  try {
    const { routeID, taskID } = req.params;
    const { rows: taskRows } = await pool.query(
      'SELECT * FROM tasks WHERE task_id = $1',
      [taskID]
    );
    const task = taskRows[0];

    if (
      !task ||
      !(await checkAdminOrAssigned(req.user.user_id, req.user.role, routeID))
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM tasks_issues JOIN issues ON tasks_issues.issue_id = issues.issue_id WHERE task_id = $1;',
      [taskID]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving task issues' });
  }
};

exports.addTaskIssues = async (req, res) => {
  try {
    const { taskId, issue_ids } = req.body;
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
      text: `INSERT INTO tasks_issues (task_id, issue_id) VALUES ${issue_ids
        .map((_, i) => `($1, $${i + 2})`)
        .join(', ')} RETURNING *;`,
      values: [taskId, ...issue_ids],
    };

    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding task issues' });
  }
};

exports.deleteTaskIssue = async (req, res) => {
  try {
    const { taskId, issue_id } = req.body;
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
      `DELETE FROM tasks_issues WHERE task_id = $1 AND issue_id = $2 RETURNING *;`,
      [taskId, issue_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting task issues' });
  }
};

exports.getIssues = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await pool.query('SELECT * FROM issues;');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving issues' });
  }
};

exports.addIssues = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { issue_id, issue_name, issue_color, issue_type } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO issues (issue_id, issue_name, issue_type, issue_color) VALUES ($1, $2, $3, $4) RETURNING *;',
      [issue_id, issue_name, issue_type, issue_color]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding issue' });
  }
};

exports.updateIssues = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { issue_id, issue_name } = req.body;
    const { rows } = await pool.query(
      'UPDATE issues SET issue_name = $1 WHERE issue_id = $2 RETURNING *;',
      [issue_name, issue_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating issue' });
  }
};

exports.deleteIssues = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { issue_id } = req.body;
    await pool.query('DELETE FROM tasks_issues WHERE issue_id = $1;', [
      issue_id,
    ]);
    const { rows } = await pool.query(
      'DELETE FROM issues WHERE issue_id = $1 RETURNING *;',
      [issue_id]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting issue' });
  }
};
