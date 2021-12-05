const express = require('express');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const app = express();

// function to generate signtoken
const signToken = id => {
    return jwt.sign({
        id
    },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === "https"
    });

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

// create a user and export it
exports.signup = catchAsync(
    async (req, res, next) => {
        const newUser = await User.create(req.body);

        createSendToken(newUser, 201, req, res);

    }
);

// Signin the user
exports.signin = catchAsync(
    async (req, res, next) => {
        const { email, password } = req.body;
        // Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Plese provide email and password', 400));
        }

        // Check if user exist and password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // If every thing is okey, then send token to client

        createSendToken(user, 200, req, res);
    }
);

// Logout the user by sending cookie without token
exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(
            Date.now() + 10 * 1000
        ),
        httpOnly: true
    });

    res.status(200)
        .json({
            status: 'success'
        });
};

// Method to check User is loged in or not 
exports.protect = catchAsync(
    async (req, res, next) => {

        let token;

        // 1) Get the token and check it's there
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
                new AppError('You are not loged in, please login to get access', 401)
            );
        }

        // 2) Varification of token

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user belongs to this token does no longer exist.', 401));
        }

        // 4) check if user has changed the password after token was issued

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError('Recentlry changed the password, Login again', 401)
            );
        }

        // Grant access to the prodected rout

        req.user = currentUser;
        res.locals.user = currentUser;

        next();
    }
);

// Only for render pages, there will be no error
exports.isLogedIn = catchAsync(
    async (req, res, next) => {
        if (req.cookies.jwt) {
            // 1) Verify the token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) check if user has changed the password after token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // There is a loged in user
            //It is accessable to the template
            res.locals.user = currentUser;
            return next();
        }
        next();
    }
);


// function to restrict access

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'lead-guide'], role = 'user'
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission.', 403))
        }

        next();
    }
}