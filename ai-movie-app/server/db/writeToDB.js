import connectDB from './connection.js';

const writeToDB = async (query, values) => {
  const client = await connectDB();
  try {
    await client.query('BEGIN');
    const res = await client.query(query, values);
    await client.query('COMMIT');
    return res.rows[0]; // Return the first row of the result
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.end();
  }
};

export default writeToDB;
