const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * =========================
 * SIGNUP CONTROLLER
 * =========================
 * Rules:
 * - Role is NEVER taken from frontend
 * - Admin cannot signup
 * - Club owner only if email exists in club_owner_whitelist
 * - Otherwise user is a student
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, registrationNumber } = req.body;

    /* =========================
       1️⃣ BASIC VALIDATION
    ========================= */
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'email, password, firstName and lastName are required'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    /* =========================
       2️⃣ CHECK EXISTING USER
    ========================= */
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'Email already registered. Please login.'
      });
    }

    /* =========================
       3️⃣ CHECK CLUB OWNER WHITELIST
    ========================= */
    const whitelistCheck = await db.query(
      `SELECT club_id
       FROM club_owner_whitelist
       WHERE email = $1 AND is_active = true`,
      [email]
    );

    let role = 'student';
    let clubId = null;

    if (whitelistCheck.rows.length > 0) {
      // ✅ Approved club owner
      role = 'club_owner';
      clubId = whitelistCheck.rows[0].club_id;
    } else {
      // 👩‍🎓 Student rules
      if (!registrationNumber || !registrationNumber.trim()) {
        return res.status(400).json({
          error: 'Registration number is required for students'
        });
      }

      // Ensure registration number is unique
      const regExists = await db.query(
        'SELECT id FROM users WHERE registration_number = $1',
        [registrationNumber.trim()]
      );

      if (regExists.rows.length > 0) {
        return res.status(400).json({
          error: 'Registration number already exists'
        });
      }
    }

    /* =========================
       4️⃣ HASH PASSWORD
    ========================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================
       5️⃣ INSERT USER
    ========================= */
    const result = await db.query(
      `INSERT INTO users
       (email, password_hash, first_name, last_name, registration_number, role, club_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, role, club_id`,
      [
        email,
        hashedPassword,
        firstName,
        lastName,
        role === 'student' ? registrationNumber.trim() : null,
        role,
        clubId
      ]
    );

    return res.status(201).json({
      message: '✅ User registered successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      error: 'Signup failed. Please try again.'
    });
  }
};

/**
 * =========================
 * LOGIN CONTROLLER (UNCHANGED)
 * =========================
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 2️⃣ Verify password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
        role: user.rows[0].role,
        clubId: user.rows[0].club_id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    // 4️⃣ Return user
    const userData = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      first_name: user.rows[0].first_name,
      last_name: user.rows[0].last_name,
      role: user.rows[0].role,
      registration_number: user.rows[0].registration_number,
      club_id: user.rows[0].club_id
    };

    res.json({
      message: '✅ Login successful',
      token,
      user: userData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
};