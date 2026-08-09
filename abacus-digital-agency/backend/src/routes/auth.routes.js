const express = require('express');
const authController = require('../controllers/auth.controller');
const protect = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const {
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.patch('/profile', protect, validate(updateProfileSchema), authController.updateProfile);
router.patch(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  authController.changePassword
);
router.post('/2fa/enable', protect, authController.enableTwoFactor);
router.post('/2fa/disable', protect, authController.disableTwoFactor);

module.exports = router;
