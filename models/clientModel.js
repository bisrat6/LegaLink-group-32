const db = require('./db');

exports.getClient = async (id) => {
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
  return { user: result.rows[0], case: result2.rows };
};

exports.updateClient = async (updates, values, id) => {
  // 'updates' already contains properly parameterized fragments like "column=$1"
  const setClause = updates.join(', ');
  const result = await db.query(
    `
    UPDATE users
    SET ${setClause}
    WHERE user_id = $${values.length + 1}
    RETURNING *
  `,
    [...values, id],
  );

  return result.rows[0] || null;
};
