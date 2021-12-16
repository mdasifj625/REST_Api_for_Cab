import path from 'path';
const __dirname = path.resolve();
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import userRoutes from './routers/userRoutes.js';
import bookingRoutes from './routers/bookingRouts.js';
import cabRoutes from './routers/cabRouts.js';
import globalErrorHandler from './controllers/errorController.js';

// Start express app
const app = express();
app.enable('trust proxy');

// Swagger implementation
// import { serve, setup } from 'swagger-ui-express';
// import swaggerDocument from './swagger.json'

// Global Middleware

// Implement CORS
app.use(cors());


app.options('*', cors());
// app.options('/api/v1/cabs', cors());


// Serving static files
app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);


// Set Security HTTP Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limiter to limit the no of request in an hour
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Your have reached to the maximum attempt from this IP, Please try after 1 hour'
});
app.use('/api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}));
// Cookie parser
app.use(cookieParser());


// Data Senitization against NoSQL Query injection
app.use(mongoSanitize());

// Data Senitization against XSS
app.use(xss());

// Prevent parameter polution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize', 'difficulty',
        'price'
    ]
}));

app.use(compression());

// MIddleware to set header
app.use((req, res, next) => {
    res
        .set("Content-Security-Policy",
            "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;");
    next();
});

// routs
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/cabs', cabRoutes);
// app.use('/api-docs', serve, setup(swaggerDocument));


// Handle unknown routs
app.all('*', (req, res, next) => {
    // Creating and passing errorn in the next method by the help of AppError class
    next(new AppError(`Can't find ${req.originalUrl} on our server`, 404));
});

// Handle the global error
app.use(globalErrorHandler);

export default app;