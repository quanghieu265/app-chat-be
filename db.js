const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host:
    process.env.NODE_ENV === "development"
      ? "localhost"
      : process.env.SUPABASE_HOST,
  database: process.env.NODE_ENV === "development" ? "perntodo" : "postgres",
  password:
    process.env.NODE_ENV === "development"
      ? "Admin"
      : process.env.SUPABASE_DATABASE_PASSWORD,
  port: 5432,
});

module.exports = pool;
