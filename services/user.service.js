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
    user.user_phone_number || null,
    user.user_pass,
    user.user_img || null,
    user.role_id || 1,
  ];

  return await db.query(query, values);
}


// Get user by UUID
async function getUserByUuid(uuid) {
  const query = `SELECT * FROM users WHERE uuid = ?`;
  const rows = await db.query(query, [uuid]);
  return rows.length ? rows[0] : null;
}
async function updateUserByUuid(uuid, userData) {
  const query = `
    UPDATE users 
    SET user_first_name = ?, 
        user_last_name = ?, 
        user_email = ?, 
        user_phone_number = ?, 
        user_img = ?, 
        role_id = ?
    WHERE uuid = ?`;

  const values = [
    userData.user_first_name || "",
    userData.user_last_name || "",
    userData.user_email || "",
    userData.user_phone_number ?? null,
    userData.user_img ?? null,
    userData.role_id ?? 1,
    uuid,
  ];

  if (!uuid) {
    throw new Error("UUID is required for updating a user.");
  }

  return await db.query(query, values);
}

// Delete user by UUID
async function deleteUserByUuid(uuid) {
  const query = `DELETE FROM users WHERE uuid = ?`;
  return await db.query(query, [uuid]);
}

// Get user by email (updated to handle single row return)
async function getUserByEmail(user_email) {
  try {
    const trimmedEmail = user_email.trim().toLowerCase(); // Normalize input

    const query = `SELECT * FROM users WHERE LOWER(TRIM(user_email)) = ?`;
    const rows = await db.query(query, [trimmedEmail]);

    // console.log("Query Result:", rows); // Debugging log

    return rows.length ? rows[0] : null; // Return the first row if available
  } catch (error) {
    // console.error("Database Error:", error);
    return null; // Return null in case of error
  }
}

// Check if user exists (updated to handle single row return)
const checkIfUserExists = async (user_email) => {
  try {
    if (!user_email) {
      // console.error("❌ checkIfUserExists: Email is undefined or null.");
      return false;
    }

    const trimmedEmail = user_email.trim().toLowerCase();
    // console.log("📧 Checking existence for:", trimmedEmail);

    const query = "SELECT * FROM users WHERE LOWER(TRIM(user_email)) = ?";
    const rows = await db.query(query, [trimmedEmail]);

    // console.log("🔍 Query Result:", rows);

    if (rows.length > 0) {
      // console.log("✅ User found:", rows[0]);
      return true;
    }

    // console.log("🚫 No user found with this email.");
    return false;
  } catch (error) {
    // console.error("❌ Database error in checkIfUserExists:", error);
    return false;
  }
};
const getUsersByRole = async (roleId) => {
  const sql = `SELECT user_id, user_email, user_first_name, user_last_name, user_phone_number, role_id, active_user_status, user_added_date, user_img,uuid 
               FROM users WHERE role_id = ?`;

  return await db.query(sql, [roleId]);
};


module.exports = {
  getAllUsers,
  createUser,
  getUserByUuid,
  updateUserByUuid,
  deleteUserByUuid,
  getUserByEmail,
  checkIfUserExists,
  getUsersByRole,
};