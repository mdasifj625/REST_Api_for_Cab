const mongoose = require("mongoose");

// Creating Review Schema
const bookingSchema = new mongoose.Schema(
    {
        cab: {
            type: mongoose.Schema.ObjectId,
            ref: 'Cab'
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to user']
        },
        pickupLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String
        },
        dropLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String
        },
        price: {
            type: Number,
            required: [true, `Booking must have a price.`]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

// Middleware to populate the user and tour_name
bookingSchema.pre(/^find/, function (next) {
    this.populate('user')
        .populate({
            path: 'tour',
            select: 'name'
        });

    next();
})


// Create Model out of Schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;