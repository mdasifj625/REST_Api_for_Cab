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

    // Agregated result of cab
    const cabs = await Cab.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat]
                },
                distanceField: 'distance',
                maxDistance: 3000,
                distanceMultiplier: 0.001
            }
        },

        {
            $match: { booked: false }
        },
        {
            $project: {
                distance: 1,
                booked: 1,
                location: 1,
                driver: 1
            }
        }
    ]);

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
exports.bookCab = catchAsync(async (req, res, next) => {

    const { pickup, drop } = req.params;
    const from = pickup.split(',');
    const to = drop.split(',');

    const distance = distanceCalculator(from[0], from[1], to[0], to[1]);

    const fare = Math.ceil(10 * distance);

    console.log(`
    pickup: ${pickup}
    drop: ${drop}
    distance: ${distance}
    fare: ${fare}
    `);

    // const trip = await Trip.create({
    //     fare,
    //     "from": { "type": "Point", "coordinates": from },
    //     "to": { "type": "Point", "coordinates": to },
    //     "user": req.user._id
    // });

    // // cab booked
    res.status(200).json({
        status: 'success',
        data: {
            status: 'cab booked successfully',
            data: req.query.cab
        }
    });

});


exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllMyBookings = factory.getAll(Booking);