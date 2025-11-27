const errorHandler = (err, req, res, next) => {
    // لاگ کردن خطا برای دیباگ
    console.error(err.stack); 

    // تعیین وضعیت HTTP (اگر خطا وضعیت نداشت، 500 در نظر بگیر)
    const statusCode = err.status || 500;

    // ارسال پاسخ خطای استاندارد
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Something went wrong on the server',
            status: statusCode,
            // جزئیات خطا را فقط در محیط توسعه نمایش بده
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
};

module.exports = errorHandler;