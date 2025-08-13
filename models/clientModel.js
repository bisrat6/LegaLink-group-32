const db = require('./db');

exports.getClient = async (id) => {
  try {
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
  } catch (error) {
    console.error('Error in getClient:', error);
    throw error;
  }
};

exports.updateClient = async (updates, values, id) => {
  try {
    const result = await db.query(
      `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE user_id = ${id}
    RETURNING *
  `,
      values,
    );

    return result.rows;
  } catch (error) {
    console.error('Error in updateClient:', error);
    throw error;
  }
};

// exports.createClient = async (profile)=>{
//     const result = await db.query(`
//         INSERT INTO users ()`)
// }
