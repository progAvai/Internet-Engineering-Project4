const User = require('../models/user');
const { validationResult } = require('express-validator');
const asyncHandler = require('../middleware/asyncHandler'); // ۱. ایمپورت کردن

// تمام توابع را با asyncHandler می‌پوشانیم و async/await اضافه می‌کنیم

const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.getAll();
    res.status(200).json(users);
});

const getUserById = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const user = await User.getById(id);
    
    if (!user) {
        // ساخت یک خطای سفارشی که errorHandler آن را مدیریت کند
        const error = new Error('User not found');
        error.status = 404;
        return next(error); // ۳. ارسال خطا به errorHandler
    }
    res.status(200).json(user);
});

const createUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(err => ({ msg: err.msg, param: err.param }));
        // توجه: اینجا چون خودمان json را می‌فرستیم، next(error) نمی‌زنیم
        return res.status(400).json({
            success: false,
            error: { message: 'Validation failed', status: 400, details: errorDetails }
        });
    }

    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });
    res.status(201).json(newUser);
});

const updateUser = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id);
    
    // (اعتبارسنجی express-validator را هم مثل createUser اینجا اضافه کنید)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       // ... (کد مدیریت خطای اعتبارسنجی) ...
       const errorDetails = errors.array().map(err => ({ msg: err.msg, param: err.param }));
        // توجه: اینجا چون خودمان json را می‌فرستیم، next(error) نمی‌زنیم
        return res.status(400).json({
            success: false,
            error: { message: 'Validation failed', status: 400, details: errorDetails }
        });
    }

    const updatedUser = await User.update(id, req.body);
    if (!updatedUser) {
        const error = new Error('User not found');
        error.status = 404;
        return next(error);
    }
    res.status(200).json(updatedUser);
});

const deleteUser = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.id);
    const success = await User.remove(id);
    if (!success) {
        const error = new Error('User not found');
        error.status = 404;
        return next(error);
    }
    res.status(204).send(); // 204 No Content پاسخی ندارد و فرمت نمی‌شود
});

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};