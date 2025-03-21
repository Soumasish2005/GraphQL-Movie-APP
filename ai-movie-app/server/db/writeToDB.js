import connectDB from './connection.js';

const writeToDB = async (client, query, values) => {
  try {
    await client.query('BEGIN');
    const res = await client.query(query, values);
    await client.query('COMMIT');
    return res.rows[0]; // Returning the first row of the result
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
};

export default writeToDB;
