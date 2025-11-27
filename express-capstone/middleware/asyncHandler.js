// middleware/asyncHandler.js

const asyncHandler = (fn) => (req, res, next) => {
    Promise
        .resolve(fn(req, res, next))
        .catch(next); // هر خطایی (rejection) را به errorHandler می‌فرستد
};

module.exports = asyncHandler;