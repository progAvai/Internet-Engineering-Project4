
const formatResponse = (req, res, next) => {
    // تابع اصلی res.json را در یک متغیر نگه می‌داریم
    const originalJson = res.json;

    // تابع res.json را با نسخه‌ی سفارشی خود جایگزین می‌کنیم
    res.json = (data) => {
        // این بررسی مهم است:
        // اگر پاسخ از قبل با فرمت خطا (success: false) باشد،
        // یا اگر در حال حاضر یک خطا در جریان است (مثلاً از errorHandler می‌آید)،
        // به آن دست نزن و فقط آن را ارسال کن.
        if (data.success === false || res.headersSent || res.statusCode >= 400) {
            return originalJson.call(res, data);
        }

        // در غیر این صورت، پاسخ موفق را در قالب استاندارد بپیچ
        const formattedResponse = {
            success: true,
            timestamp: new Date().toISOString(),
            data: data
        };

        // تابع اصلی را با داده‌ی فرمت‌شده فراخوانی کن
        originalJson.call(res, formattedResponse);
    };

    next();
};

module.exports = formatResponse;