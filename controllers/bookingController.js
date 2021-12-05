const Booking = require('../models/bookingModel');
const Cab = require('../models/cabModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const distanceCalculator = require('../helper/distanceCalculator');


// Find the cabs nearby
exports.findNearbyCab = catchAsync(async (req, res, next) => {

    const [lat, lng] = req.params.pickup.split(',');

    if (!lat || !lng) next(new AppError('please provide latitude and longitude', 400));

    const radius = 4 / 6378.1;  // within Km 

    const cabs = await Cab.find({
        booked: false,
        location: {
            $geoWithin: { $centerSphere: [[lng, lat], radius] }
        }
    });

    // If cabs are not available nearby
    if (cabs.length === 0) {
        return res.status(200).json({
            status: 'success',
            data: 'Cabs are busy, try later'
        });
    }

    // Assigning the cabs to query for next middleware
    req.query.cabs = cabs;

    next();

});

// Book cab based on driver response
exports.driverConfirmation = catchAsync(async (req, res, next) => {

    const cabs = req.query.cabs;

    // Generating a random number between 0 and and less than cabs length
    const randomCab = Math.floor(Math.random() * cabs.length);

    // Assigning cab to query randomly for next middleware
    req.query.cab = cabs[randomCab];

    next();
});


// Finaly book the cab and save to database
exports.arangeCab = catchAsync(async (req, res, next) => {

    const cab = req.query.cab;
    const user = req.user;
    const { pickup, drop } = req.params;
    const from = pickup.split(',');
    const to = drop.split(',');

    // Calculating the distance between two points
    const distance = distanceCalculator(from[0], from[1], to[0], to[1]);

    const fare = Math.ceil(10 * distance);

    // Assigning the booking data to body for next middleware
    req.body = {
        cab: cab._id,
        user,
        from: {
            "coordinates": from,
            address: 'Dummy Pickup address'
        },
        distance,
        to: {
            "coordinates": to,
            address: 'Dummy drop address'
        },
        fare
    }

    // Marking the cab as booked
    cab.booked = true;
    await cab.save({ validateBeforeSave: false });

    next();

});

exports.bookCab = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllMyBookings = factory.getAll(Booking);