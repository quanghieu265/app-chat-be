const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "db.visqitgftgnhujxsmqua.supabase.co",
  database: "postgres",
  password: "Admin-app-chat@123",
  port: 5432,
});

module.exports = pool;
