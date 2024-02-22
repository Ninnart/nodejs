const { Pool } = require('pg');
const db = new Pool({
    host : "aws-0-ap-southeast-1.pooler.supabase.com",
    user: "postgres.hsyzwnjwdkoirqtgvdmn",
    password: "Busbuszaza123456",
    database: "postgres",
    port : 5432
});
module.exports = db;
