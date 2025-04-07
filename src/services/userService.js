const { Op } = require('sequelize');

class UserService {
  constructor(sequelize, userModel) {
    this.sequelize = sequelize;
    this.userModel = userModel;
    this.Op = Op;
  }

  async updateBalance(userId, amount) {
    const where = { 
      id: userId,
      ...(amount < 0 && { balance: { [this.Op.gte]: -amount } })
    };

    const [rowCount] = await this.userModel.increment(
      'balance',
      {
        by: amount,
        where,
        returning: false
      }
    );

    if (rowCount[1] === 0) {
      const user = await this.userModel.findByPk(userId);
      if (!user) throw new Error('User not found');
      throw new Error('Insufficient balance');
    }

    return this.userModel.findByPk(userId);
  }
}

module.exports = UserService;