// Catch the error of asyn functions
export const catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch(next);
    };
};