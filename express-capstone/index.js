// 1. بارگذاری متغیرهای محیطی (باید اولین خط باشد)
require('dotenv').config(); 

const express = require('express');
const https = require('https');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

// --- وارد کردن ماژول‌های سفارشی ---
const userRoutes = require('./routes/user');
const errorHandler = require('./middleware/errorHandler');
const formatResponse = require('./middleware/formatResponse');

const app = express();

// --- تنظیمات CORS ---
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};

// --- زنجیره میان‌افزارها (به ترتیب اهمیت) ---

// 1. امنیت و بهینه‌سازی
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

// 2. محدودسازی درخواست (Rate Limit)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// 3. لاگ‌گیری
app.use(morgan('dev'));

// 4. پارس کردن Body
app.use(express.json());

// 5. فرمت‌بندی پاسخ (باید قبل از روترها باشد)
app.use(formatResponse);

// --- روترها ---
app.use('/users', userRoutes);

// --- مدیریت خطا (باید آخرین میان‌افزار باشد) ---
app.use(errorHandler);

// --- راه‌اندازی سرور ---
const PORT = process.env.PORT || 3001;

// (کدهای راه‌اندازی HTTPS از فاز اول)
try {
    const sslOptions = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
    https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(`✅ Secure HTTPS Server running on https://localhost:${PORT}`);
    });
} catch (err) {
    console.warn('SSL files not found. Running in HTTP mode.');
    app.listen(PORT, () => {
        console.log(` unsecured HTTP Server running on http://localhost:${PORT}`);
    });
}