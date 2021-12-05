// Catch the error of asyn functions
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next)
            .catch(next);
    };
};