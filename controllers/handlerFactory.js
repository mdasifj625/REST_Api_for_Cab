const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Factory function for create document
exports.createOne = Model => catchAsync(
    async (req, res, next) => {

        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });

    }
);

// Factory function for update
exports.updateOne = Model => catchAsync(
    async (req, res, next) => {

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Return an error if tour is not found
        if (!doc) {
            return next(new AppError('No document found with given id', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    }
);

// Factory function for delete
exports.deleteOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        // Return an error if tour is not found
        if (!doc) {
            return next(new AppError('No document was found with given id', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    }
);

// Factory function to get one document
exports.getOne = (Model, populateOptions) =>
    catchAsync(
        async (req, res, next) => {

            let query = Model.findById(req.params.id);
            if (populateOptions) query = query.populate(populateOptions);
            const doc = await query;

            // Return an error if tour is not found
            if (!doc) {
                return next(new AppError('No Document found for given id', 404));
            }

            // const tour = Tour.findOne({ _id: req.prams.id });
            res.status(200)
                .json({
                    status: "success",
                    data: {
                        data: doc
                    }
                });
        }
    );

// Factory funcion to get all document
exports.getAll = Model => catchAsync(
    async (req, res, next) => {

        // To Allow for nested Get Reviews on Tour (Hack)
        let filter = {};
        if (req.params.userId) filter = { user: req.params.userId };

        // Execute the query
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const doc = await features.query;
        // .explain();

        
        // Send Response
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            },
        });
    }
);