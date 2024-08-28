const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Importa el modelo User de Sequelize
const ErrorResponse = require('../utils/errorResponse');
const successHandler = require('../middleware/successHandler/successHandler.middleware');
const { Op } = require('sequelize');
const { body, param, validationResult } = require('express-validator');

exports.logout = [
  (req, res, next) => {
    try {
      // No action needed for JWT
      return successHandler(req, res, 'Logged out successfully', next, 200);
    } catch (err) {
      return next(err);
    }
  },
];
exports.getAllUsers = [
  async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id_user',
          'username_user',
          'email_user',
          'role_user',
          'isactive_user',
          'created_at',
          'updated_at',
        ],
      });
      if (!users.length) {
        return next(new ErrorResponse('Users not found', null, 404));
      }
      return successHandler(req, res, 'Users retrieved successfully', users, 200);
    } catch (err) {
      return next(err);
    }
  },
];

exports.deleteUser = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isInt({ min: 1 })
    .withMessage('Id must be a positive integer'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation fields', errors.array(), 400));
    }

    try {
      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        return next(new ErrorResponse('User not found', null, 404));
      }
      await user.destroy();
      return successHandler(req, res, 'User deleted successfully', user.id_user, 200);
    } catch (err) {
      return next(err);
    }
  },
];

exports.getUserById = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isInt({
      min: 1,
    })
    .withMessage('Id must be a positive integer'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation fields', errors.array(), 400));
    }
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: [
          'id_user',
          'username_user',
          'email_user',
          'role_user',
          'isactive_user',
          'created_at',
          'updated_at',
        ],
      });
      if (!user) {
        return next(new ErrorResponse('User not found', null, 404));
      }
      return successHandler(req, res, 'User retrieved successfully', user, 200);
    } catch (err) {
      return next(err);
    }
  },
];
exports.updateEncryptedPassword = [
  body('newPassword').trim().notEmpty().withMessage('Password is required'),
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isInt({
      min: 1,
    })
    .withMessage('Id must be a positive integer'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation fields', errors.array(), 400));
    }
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const user = await User.findByPk(id);
      if (!user) {
        return next(new ErrorResponse('User not found', null, 404));
      }
      user.password_user = hashedPassword;
      await user.save();
      return successHandler(req, res, 'Encrypted password updated successfully', user.id_user, 200);
    } catch (err) {
      return next(err);
    }
  },
];

exports.createUser = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  body('email').trim().notEmpty().withMessage('Email is required'),
  body('role').notEmpty().withMessage('Role is required').isInt({ min: 1 }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorResponse('Validation fields', errors.array(), 400));
    }

    try {
      const { username, password, email, role } = req.body;
      const exisitsUser = await User.findOne({
        where: { [Op.or]: [{ username_user: username }, { email_user: email }] },
      });
      if (exisitsUser) {
        return next(new ErrorResponse('Username or email already exists', null, 400));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username_user: username,
        password_user: hashedPassword,
        email_user: email,
        role_user: role,
      });
      return successHandler(req, res, 'User created successfully', newUser, 201);
    } catch (err) {
      return next(err);
    }
  },
];
