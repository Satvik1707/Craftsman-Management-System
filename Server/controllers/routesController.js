const { pool } = require('../config/db');

exports.getRoutes = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      const { rows } = await pool.query(
        'SELECT * FROM routes where employee_id = $1;',
        [req.user.user_id]
      );
      return res.json(rows);
    }

    const { rows } = await pool.query('SELECT * FROM routes;');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving routes' });
  }
};

exports.fetchTasksForRoutes = async (req,res) => {
  try{
    const {routeId} = req.params;
    const {rows} = await pool.query(
      'SELECT * FROM tasks WHERE route_id = $1;',
      [routeId]
    )

    console.log(rows);
    res.status(200).json(rows);

  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
}

exports.createRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { route_name, employee_id, status } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO routes (route_name, employee_id, created_at, modified_at, status) VALUES ($1, $2, (NOW()::timestamp), (NOW()::timestamp), $3) RETURNING *;',
      [route_name, employee_id, status]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating route' });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { routeId } = req.params;
    const { route_name, employee_id, status } = req.body;

    const { rows } = await pool.query(
      'UPDATE routes SET route_name = $1, employee_id = $2, modified_at = NOW(), status = $3 WHERE route_id = $4 RETURNING *;',
      [route_name, employee_id, status, routeId]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating route' });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { routeId } = req.params;
    const { rows: tasks } = await pool.query(
      'SELECT task_id FROM tasks WHERE route_id = $1;',
      [routeId]
    );
    const taskIds = tasks.map((task) => task.task_id);
    await pool.query('BEGIN');
    for (const taskId of taskIds) {
      await pool.query('DELETE FROM tasks_issues WHERE task_id = $1;', [
        taskId,
      ]);
      await pool.query('DELETE FROM tasks_materials WHERE task_id = $1;', [
        taskId,
      ]);
      await pool.query('DELETE FROM tasks_tools WHERE task_id = $1;', [taskId]);
    }
    await pool.query('DELETE FROM tasks WHERE route_id = $1;', [routeId]);
    const { rows } = await pool.query(
      'DELETE FROM routes WHERE route_id = $1 RETURNING *;',
      [routeId]
    );
    await pool.query('COMMIT');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error deleting route' });
  }
};
