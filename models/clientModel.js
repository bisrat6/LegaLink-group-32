const db = require('./db');
const catchAsync = require('../utils/catchAsync');

exports.getClient =async (id) => {
  const result = await db.query(
    `
        SELECT * FROM users WHERE user_id=$1 AND role='client'
          `,
    [id],
  );
  const result2 = await db.query(
    `
      SELECT * FROM cases WHERE client_id=$1`,
    [id],
  );
  return [result.rows[0], result2.rows];
};

exports.updateClient = async (updates, values, id) => {
  // Build safe parameterized query
  const setClause = updates
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');
  const result = await db.query(
    `
    UPDATE users
    SET ${setClause}
    WHERE user_id = $${updates.length + 1}
    RETURNING *
  `,
    [...values, id],
  );

  return result.rows;
};

// exports.createClient = async (profile)=>{
//     const result = await db.query(`
//         INSERT INTO users ()`)
// }
