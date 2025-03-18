import connectDB from './connection.js';

const writeToDB = async (query, values) => {
  const client = await connectDB();
  try {
    await client.query('BEGIN');
    const res = await client.query(query, values);
    await client.query('COMMIT');
    return res;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.end();
  }
};

export default writeToDB;
