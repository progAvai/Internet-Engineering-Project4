// middleware/logger.js
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next(); // بسیار مهم! فراخوانی next() تا زنجیره ادامه یابد
};

module.exports = logger;