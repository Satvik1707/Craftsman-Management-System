const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // const username = "Shane_Kutch";
    // const password = "password123";

    const {rows}  = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    // console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({ message: 'Logged in successfully.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};
