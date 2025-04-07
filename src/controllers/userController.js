class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async updateBalance(req, res) {
    const { userId, amount } = req.body;
    
    try {
      const updatedUser = await this.userService.updateBalance(userId, amount);
      res.json({
        message: 'Balance updated successfully',
        balance: updatedUser.balance
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === 'Insufficient balance') {
        return res.status(400).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = UserController;