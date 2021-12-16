import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Creating Review Schema
const bookingSchema = new Schema(
    {
        cab: {
            type: Schema.ObjectId,
            ref: 'Cab'
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            required: [true, 'Booking must belong to user']
        },
        from: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String
        },
        to: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String
        },
        distance: Number,
        fare: {
            type: Number,
            required: [true, `Booking must have a price.`]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

// Middleware to populate the user and cab
bookingSchema.pre(/^find/, function (next) {
    this.populate('user')
        .populate({
            path: 'cab'
        });

    next();
})


// Create Model out of Schema
const Booking = model('Booking', bookingSchema);

export default Booking;