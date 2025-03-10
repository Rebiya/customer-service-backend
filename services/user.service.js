const db = require("../Config/db.config.js");

// Get all users
async function getAllUsers() {
  const query = `SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id`;
  return await db.query(query);
}

// Create user (handles optional user_phone_number & user_img)
async function createUser(user) {
  const query = `
    INSERT INTO users 
    (user_first_name, user_last_name, user_email, user_phone_number, user_pass, user_img, role_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    user.user_first_name,
    user.user_last_name,
    user.user_email,
    user.user_phone_number || null, // Allow null phone numbers
    user.user_pass, // Already hashed in controller
    user.user_img || null, // Allow null images
    user.role_id || 1, // Default role: 1 (if not provided)
  ];

  return await db.query(query, values);
}

// Get user by ID
async function getUserById(user_id) {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  const [rows] = await db.query(query, [user_id]);
  return rows.length ? rows[0] : null;
}

// Update user (fixes missing parameters)
async function updateUser(user_id, userData) {
  const query = `
    UPDATE users 
    SET user_first_name = ?, user_last_name = ?, user_email = ?, user_phone_number = ?, user_img = ?, role_id = ?
    WHERE user_id = ?`;

  const values = [
    userData.user_first_name,
    userData.user_last_name,
    userData.user_email,
    userData.user_phone_number || null,
    userData.user_img || null,
    userData.role_id,
    user_id,
  ];

  return await db.query(query, values);
}

// Delete user
async function deleteUser(user_id) {
  const query = `DELETE FROM users WHERE user_id = ?`;
  return await db.query(query, [user_id]);
}
async function getUserByEmail(user_email) {
  try {
    const trimmedEmail = user_email.trim().toLowerCase(); // Normalize input

    const query = `SELECT * FROM users WHERE LOWER(TRIM(user_email)) = ?`;
    const [rows] = await db.query(query, [trimmedEmail]);

    console.log("Query Result:", rows); // Debugging log

    return rows.length ? rows : []; // Always return an array
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}


module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail
};
