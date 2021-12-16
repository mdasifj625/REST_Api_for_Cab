import mongoose from "mongoose";
const { Schema, model, connect } = mongoose;
import { config } from 'dotenv';
config({
    path: `./config.env`
});
import app from './app.js';

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD);

// Connect to mongoDb using mongoose
connect(
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