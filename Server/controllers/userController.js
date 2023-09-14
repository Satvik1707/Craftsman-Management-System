const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

exports.getSettings = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM settings;');
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { office_address, office_name, latitude, longitude } = req.body;
    const id = 1;

    const updateFields = [
      { field: 'office_address', value: office_address },
      { field: 'office_name', value: office_name },
      { field: 'latitude', value: latitude },
      { field: 'longitude', value: longitude },
    ];

    const updateQuery = updateFields
      .map((field, index) => `${field.field} = $${index + 1}`)
      .join(', ');

    const { rows } = await pool.query(
      `UPDATE settings SET ${updateQuery} WHERE id = $${
        updateFields.length + 1
      }`,
      [...updateFields.map((field) => field.value), id]
    );

    res.json({ message: 'Settings updated successfully.', settings: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { user_id, username, password, role, email, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users(user_id, username, password, role, email, phone) VALUES ($1, $2, $3, $4, $5, $6) returning *',
      [user_id, username, hashedPassword, role, email, phone]
    );
    res.json({ message: 'User created successfully.', user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { user_id } = req.user;

    const { rows } = await pool.query(
      'SELECT * FROM users WHERE user_id = $1;',
      [user_id]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user data' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { userID } = req.params;
    if (userID !== undefined) {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE user_id = $1;',
        [userID]
      );
      return res.json(rows);
    }
    const { rows } = await pool.query('SELECT * FROM users;');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving users list' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { user_id, username, password, role, email, phone } = req.body;

    const updateFields = [
      { field: 'username', value: username },
      { field: 'role', value: role },
      { field: 'email', value: email },
      { field: 'phone', value: phone },
    ];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push({ field: 'password', value: hashedPassword });
    }

    const updateQuery = updateFields
      .map((field, index) => `${field.field} = $${index + 1}`)
      .join(', ');

    const { rows } = await pool.query(
      `UPDATE users SET ${updateQuery} WHERE user_id = $${
        updateFields.length + 1
      }`,
      [...updateFields.map((field) => field.value), user_id]
    );

    res.json({ message: 'User updated successfully.', user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { user_id } = req.body;
    await pool.query('BEGIN');

    await pool.query(
      'UPDATE routes SET employee_id = 0 WHERE employee_id = $1',
      [user_id]
    );

    const { rows } = await pool.query('DELETE FROM users WHERE user_id = $1', [
      user_id,
    ]);

    await pool.query('COMMIT');

    res.json(rows);
  } catch (error) {
    console.error(error);
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error deleting user' });
  }
};
