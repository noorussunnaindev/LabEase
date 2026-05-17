import { User } from '../entities/User.js';
import { hashPassword, comparePasswords, generateToken, validateEmail } from '../utils/helpers.js';
import { getRepository } from '../utils/database.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName, phone, role } = userData;

    if (!validateEmail(email)) {
      throw new AppError('Invalid email format', 400);
    }

    const repository = getRepository(User);
    const existingUser = await repository.findOne({ where: { email } });

    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = repository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: role || 'CUSTOMER', // Default to CUSTOMER if not provided
      isActive: true
    });

    const savedUser = await repository.save(user);
    const token = generateToken(savedUser);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role
      },
      token
    };
  }

  async login(email, password) {
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };
  }

  async verifyToken(token) {
    // Verification happens in middleware, this method is for additional checks
    const repository = getRepository(User);
    const user = await repository.findOne({ where: { id: token.id } });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    return user;
  }
}
