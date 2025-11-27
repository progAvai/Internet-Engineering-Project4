// // middleware/auth.js
// // (در مرحله بعد این کلید را به .env منتقل می‌کنیم)
// const FAKE_API_KEY = 'mysecretapikey123'; 

// const auth = (req, res, next) => {
//     const apiKey = req.headers['x-api-key'];
    
//     if (!apiKey) {
//         // اگر کلید وجود نداشت
//         return res.status(401).json({ message: 'Unauthorized: Missing API Key' });
//     }

//     if (apiKey !== FAKE_API_KEY) {
//         // اگر کلید اشتباه بود
//         return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
//     }

//     // اگر کلید معتبر بود، اجازه عبور می‌دهیم
//     next();
// };

// module.exports = auth;

// middleware/auth.js (نهایی)
require('dotenv').config(); // بارگذاری متغیرها از .env

const API_KEY = process.env.API_KEY; // خواندن کلید از .env

const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or Missing API Key' });
    }
    
    next();
};

module.exports = auth;