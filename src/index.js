const express = require('express');
const { Sequelize } = require('sequelize');
const { Umzug } = require('umzug');
const path = require('path');
const config = require('./config/config');

const app = express();
app.use(express.json());

// Database setup
const sequelize = new Sequelize(config.development.url, {
  dialect: 'postgres',
  logging: false,
  ...config.development
});

// Model setup
const User = require('./models/user')(sequelize, Sequelize.DataTypes);


// Service setup
const UserService = require('./services/userService');
const userService = new UserService(sequelize, User);

// Controller setup
const UserController = require('./controllers/userController');
const userController = new UserController(userService);

// Migrations setup
const SequelizeMeta = require('./models/sequelizeMeta')(sequelize, Sequelize.DataTypes);
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, './migrations/*.js'),
    resolve: ({ name, path: migrationPath }) => {
      const migration = require(migrationPath);
      return {
        name,
        up: async () => migration.up(sequelize.getQueryInterface(), Sequelize),
        down: async () => migration.down(sequelize.getQueryInterface(), Sequelize),
      };
    }
  },
  context: sequelize.getQueryInterface(),
  logger: console,
});

// Routes
const updateBalanceValidator = require('./validators/updateBalanceValidator');
app.post('/balance', updateBalanceValidator, (req, res) => userController.updateBalance(req, res));

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    
    // Sync models first
    await sequelize.sync();
    
    // Run migrations
    await umzug.up();
    
    app.listen(3000, () => console.log('Server running on port 3000'));
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

start();