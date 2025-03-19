const { query } = require("../Config/db.config"); // Correct import
const fs = require("fs");
const path = require("path");

async function install() {
  const queryfile = path.join(__dirname, "sql", "asql.sql");

  let queries = [];
  let finalMessage = {};
  let currentQuery = "";

  // Read SQL file and split it into queries
  const sqllines = fs.readFileSync(queryfile, "utf-8").split("\n");

  sqllines.forEach((line) => {
    if (line.trim().startsWith("--") || line.trim() === "") {
      return; // Ignore comments and empty lines
    }

    currentQuery += line;

    if (line.trim().endsWith(";")) {
      queries.push(currentQuery);
      currentQuery = "";
    }
  });

  // Execute SQL queries one by one
  for (let i = 0; i < queries.length; i++) {
    try {
      await query(queries[i]); // Call query function correctly
      console.log(`✅ Query ${i + 1} executed successfully`);
    } catch (err) {
      console.error(`❌ Error executing query ${i + 1}:`, err);
      finalMessage.message = "Database tables creation failed";
      finalMessage.status = 500;
      return finalMessage;
    }
  }

  finalMessage.message = "✅ Database tables created successfully";
  finalMessage.status = 200;

  return finalMessage;
}

module.exports = { install };
