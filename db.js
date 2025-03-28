const { Client } = require("pg");

const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "backend_test",
  password: "bklmdr24",
  port: 5432,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connected");
  }
});

module.exports = db;
