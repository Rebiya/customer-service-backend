//import the query function from the config folder
const db = require("../Config/db.config.js"); // Import entire module

const { get } = require("../routes/user.route.js");

// A function to get all users
async function getAllUsers() {
  const query = `
    SELECT * 
    FROM users 
    INNER JOIN roles ON users.role_id = roles.role_id`;
  const rows = await db.query(query);
  return rows;
}
//A function to create a user
async function createUser(user) {
  const query = `
    INSERT INTO users 
    (user_first_name, user_last_name, user_email, user_password, role_id) 
    VALUES (?, ?, ?, ?, ?)`;
  const result = await db.query(query, [
    user.user_first_name,
    user.user_last_name,
    user.user_email,
    user.user_password,
    user.role_id,
  ]);
  return result;
}
// A function to get user by id
async function getUserById(user_id) {
  const query = `
    SELECT * 
    FROM users 
    INNER JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_id = ?`;
  const rows = await db.query(query, [user_id]);
  return rows;
}
// A function to get user by email
async function getUserByEmail(user_email) {
  const query = `
    SELECT * 
    FROM users 
    INNER JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_email = ?`;
  const rows = await db.query(query, [user_email]);
  return rows;
}
// A function to update a user
async function updateUser(user) {
  const query = `
    UPDATE users 
    SET user_first_name = ?, user_last_name = ?, user_email = ?, role_id = ?
    WHERE user_id = ?`;
  const result = await db.query(query, [
    user.user_first_name,
    user.user_last_name,
    user.user_email,
    user.role_id,
    user.user_id,
  ]);
  return result;
}
// A function to delete a user
async function deleteUser(user_id) {
  const query = `
    DELETE FROM users 
    WHERE user_id = ?`;
  const result = await db.query(query, [user_id]);
  return result;
}
//export the functions
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
