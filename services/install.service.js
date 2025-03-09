const query = require("../Config/db.config");
const fs = require("fs");

async function install() {
  const queryfile = __dirname + "/sql/asql.sql";
  // console.log(queryfile);

  let queries = [];
  let finalMessage = {};
  let currentQuery = "";
  const sqllines = await fs.readFileSync(queryfile, "utf-8").split("\n");

  const executed = await new Promise((resolve, reject) => {
    sqllines.forEach((line) => {
      if (line.trim().startsWith("--") || line.trim() === "") {
        return;
      }

      currentQuery += line;
      if (line.trim().endsWith(";")) {
        queries.push(currentQuery);
        currentQuery = "";
      }
    });
    resolve("queries are added to the list");
  });

  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await query(queries[i]);
      // console.log(`Executing query ${i + 1}: ${queries[i]}`);
      console.log("tables created");
    } catch (err) {
      console.log(`Error executing query ${i + 1}: ${queries[i]}`);
      console.log(err);
      finalMessage.message = "Database tables creation failed";
      finalMessage.status = 500;
      return finalMessage;
    }
  }

  finalMessage.message = "Database tables created successfully";
  finalMessage.status = 200;

  return finalMessage;
}

module.exports = { install };
