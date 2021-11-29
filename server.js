const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: `./config.env`
});
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

// Connect to mongoDb using mongoose
mongoose.connect(
    DB, {
}).then(() => console.log("DB connected Successfully!"));


const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on Port no: ${process.env.PORT}....`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!, Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM Received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated.');
    });
});