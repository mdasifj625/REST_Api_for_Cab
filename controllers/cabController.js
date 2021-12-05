const Cab = require('../models/cabModel');
const factory = require('./handlerFactory');

// Create A Cab
exports.createCab = factory.createOne(Cab);

// Get single cab details
exports.getCab = factory.getOne(Cab);

// Get all cab details
exports.getAllCabs = factory.getAll(Cab);

// Update cab details
exports.updateCab = factory.updateOne(Cab);

// Delete the cab
exports.deleteCAb = factory.deleteOne(Cab);
