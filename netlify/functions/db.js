const { neon } = require('@netlify/neon');

let sql;

function getDb() {
  if (!sql) {
    sql = neon();
  }
  return sql;
}

module.exports = { getDb };
