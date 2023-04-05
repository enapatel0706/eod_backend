const dotenv = require("dotenv");


dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;
const PORT = process.env.PORT;
const FROM_MAIL = process.env.FROM_MAIL;
const FROM_MAIL_PASS = process.env.FROM_MAIL_PASS;

module.exports = { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, PORT, FROM_MAIL, FROM_MAIL_PASS };