import { AuthService } from '../services/AuthService.js';
import { validateEmail } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

const authService = new AuthService();

export const register = async (req, res, next) => {
  try {
    let { email, password, firstName, lastName, name, phone, role } = req.body;

    // Debug logging
    console.log('📝 Register Request Body:', req.body);

    // Handle 'name' field - split it into firstName and lastName if provided
    if (name && (!firstName || !lastName)) {
      const nameParts = name.trim().split(' ');
      firstName = firstName || nameParts[0];
      lastName = lastName || nameParts.slice(1).join(' ') || nameParts[0];
    }

    console.log('📝 Parsed fields:', { email, password, firstName, lastName, phone, role });

    // Detailed validation with specific error messages
    if (!firstName || firstName.trim() === '') {
      throw new AppError('First name is required', 400);
    }
    if (!lastName || lastName.trim() === '') {
      throw new AppError('Last name is required', 400);
    }
    if (!email || email.trim() === '') {
      throw new AppError('Email is required', 400);
    }
    if (!validateEmail(email)) {
      throw new AppError('Please enter a valid email address', 400);
    }
    if (!password || password.trim() === '') {
      throw new AppError('Password is required', 400);
    }
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // For security: users registering via API always get CUSTOMER role
    // If someone tries to set admin/staff role during registration, ignore it
    if (role && role !== 'CUSTOMER') {
      console.warn(`⚠️  User attempted to set privileged role '${role}' during registration. Ignoring.`);
    }

    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'CUSTOMER' // Always set to CUSTOMER for security
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
