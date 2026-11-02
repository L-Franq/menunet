const db = require("../databases/db");

const selectRegisteredRestaurant = async () => {
  const SQL = `SELECT nome, email FROM restaurantes;`;
  try {
    const result = await db.query(SQL);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  selectRegisteredRestaurant,
};
