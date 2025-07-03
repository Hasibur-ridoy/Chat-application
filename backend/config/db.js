const {Sequelize} = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with environment variables
const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
});

module.exports = sequelize;