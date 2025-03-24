const express = require('express');
const { Sequelize } = require('sequelize');
const Umzug = require('umzug');
const path = require('path');
const config = require('./config/config');

const app = express();
app.use(express.json());

// Database setup
const sequelize = new Sequelize(config.development);

// Model setup
const User = require('./models/user')(sequelize, Sequelize.DataTypes);

// Service setup
const UserService = require('./services/userService');
const userService = new UserService(sequelize);

// Controller setup
const UserController = require('./controllers/userController');
const userController = new UserController(userService, User);

// Migrations setup
const umzug = new Umzug({
  migrations: {
    path: path.join(__dirname, './migrations'),
    params: [sequelize.getQueryInterface(), Sequelize],
  },
  context: sequelize.getQueryInterface(),
  storage: new Umzug.SequelizeStorage({ sequelize }),
  logger: console,
});

// Routes
const updateBalanceValidator = require('./validators/updateBalanceValidator');
app.post('/balance', updateBalanceValidator, (req, res) => userController.updateBalance(req, res));

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    await umzug.up();
    app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

start();