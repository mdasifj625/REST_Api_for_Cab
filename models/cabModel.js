const mongoose = require('mongoose');
// const User = require('./../model/userModel');

// Create Schema
const cabSchema = new mongoose.Schema(
    {
        booked: {
            type: Boolean,
            default: false
        },
        location: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number] // [lng, lat]
        },
        driver: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A Cab must havae a driver']
        }
    }
);

// Populate the driver
cabSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'driver',
        select: '-__v -passwordChangedAt'
    });
    next();
});

cabSchema.index({ location: '2d' });

// Model from schema

const Cab = mongoose.model('Cab', cabSchema);

module.exports = Cab;




















