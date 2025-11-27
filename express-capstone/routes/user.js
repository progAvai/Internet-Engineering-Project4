const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');
const { body } = require('express-validator'); // ۱. ایمپورت کردن

// اعمال میان‌افزار auth به *تمام* مسیرهای این روتر
router.use(auth);

// ۲. تعریف قوانین اعتبارسنجی
const userValidationRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name must be a non-empty string'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    // فرض می‌کنیم در مدل خود فیلد age را هم داریم
    body('age')
        .optional({ checkFalsy: true }) // فیلد اختیاری است
        .isInt({ gt: 0 })
        .withMessage('Age must be a positive integer')
];

// ۳. اعمال قوانین به مسیرهای مربوطه
router.post('/', userValidationRules, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userValidationRules, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;