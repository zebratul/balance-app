class UserService {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  async updateBalance(userId, amount) {
    const query = `
      UPDATE users 
      SET balance = balance + ?
      WHERE id = ?
      ${amount < 0 ? 'AND balance + ? >= 0' : ''}
    `;

    const replacements = [amount, userId];
    if (amount < 0) replacements.push(amount);

    const [rowCount] = await this.sequelize.query(query, {
      replacements,
      type: this.sequelize.QueryTypes.UPDATE,
    });

    return rowCount;
  }
}

module.exports = UserService;