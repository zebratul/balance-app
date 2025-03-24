class UserController {
  constructor(userService, userModel) {
    this.userService = userService;
    this.userModel = userModel;
  }

  async updateBalance(req, res) {
    const { userId, amount } = req.body;
    
    try {
      const rowCount = await this.userService.updateBalance(userId, amount);
      
      if (rowCount === 0) {
        const user = await this.userModel.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      return res.json({ message: 'Balance updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = UserController;