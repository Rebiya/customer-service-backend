const db = require("../Config/db.config.js");

// Get all users
async function getAllUsers() {
  const query = `SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id`;
  return await db.query(query); // No changes needed for this, it should work as expected.
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

  return await db.query(query, values); // No changes needed for this.
}

// Get user by ID
async function getUserById(user_id) {
  const query = `SELECT * FROM users WHERE user_id = ?`;
  const rows = await db.query(query, [user_id]); // No need for destructuring
  return rows.length ? rows[0] : null; // Check length of rows directly
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

  return await db.query(query, values); // No changes needed for this.
}

// Delete user
async function deleteUser(user_id) {
  const query = `DELETE FROM users WHERE user_id = ?`;
  return await db.query(query, [user_id]); // No changes needed for this.
}

// Get user by email (updated to handle single row return)
async function getUserByEmail(user_email) {
  try {
    const trimmedEmail = user_email.trim().toLowerCase(); // Normalize input

    const query = `SELECT * FROM users WHERE LOWER(TRIM(user_email)) = ?`;
    const rows = await db.query(query, [trimmedEmail]);

    console.log("Query Result:", rows); // Debugging log

    return rows.length ? rows[0] : null; // Return the first row if available
  } catch (error) {
    console.error("Database Error:", error);
    return null; // Return null in case of error
  }
}

// Check if user exists (updated to handle single row return)
const checkIfUserExists = async (user_email) => {
  try {
    if (!user_email) {
      console.error("❌ checkIfUserExists: Email is undefined or null.");
      return false;
    }

    const trimmedEmail = user_email.trim().toLowerCase();
    console.log("📧 Checking existence for:", trimmedEmail);

    const query = "SELECT * FROM users WHERE LOWER(TRIM(user_email)) = ?";
    const rows = await db.query(query, [trimmedEmail]);

    console.log("🔍 Query Result:", rows);

    if (rows.length > 0) {
      console.log("✅ User found:", rows[0]);
      return true;
    }

    console.log("🚫 No user found with this email.");
    return false;
  } catch (error) {
    console.error("❌ Database error in checkIfUserExists:", error);
    return false;
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  checkIfUserExists,
};
