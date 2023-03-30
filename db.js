const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host:
    process.env.NODE_ENV === "development"
      ? process.env.POSTGRES_HOST
      : process.env.SUPABASE_HOST,
  database: process.env.NODE_ENV === "development" ? "nodejs" : "postgres",
  password:
    process.env.NODE_ENV === "development"
      ? process.env.POSTGRES_PASSWORD
      : process.env.SUPABASE_DATABASE_PASSWORD,
  port: 5432
});

module.exports = pool;
