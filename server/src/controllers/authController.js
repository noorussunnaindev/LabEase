import { AuthService } from '../services/AuthService.js';
import { validateEmail } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      throw new AppError('Missing required fields', 400);
    }

    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password required', 400);
    }

    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const user = await authService.verifyToken(req.user);

    res.status(200).json({
      success: true,
      data: user,
      message: 'Token verified'
    });
  } catch (error) {
    next(error);
  }
};
