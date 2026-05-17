import { User } from '../entities/User.js';
import { getRepository, updateEntity, findEntity, paginate } from '../utils/database.js';
import { hashPassword } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

export class UserService {
  async getUserById(id) {
    const userRepo = getRepository(User);
    return userRepo.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'address', 'city', 'state', 'pincode', 'profilePicture', 'isActive', 'createdAt']
    });
  }

  async updateUser(id, data) {
    // Don't allow updating password through this method
    const { password, ...safeData } = data;
    return updateEntity(User, id, safeData);
  }

  async updatePassword(id, oldPassword, newPassword) {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { comparePasswords } = await import('../utils/helpers.js');
    const isPasswordValid = await comparePasswords(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    const hashedPassword = await hashPassword(newPassword);
    return updateEntity(User, id, { password: hashedPassword });
  }

  async getAllUsers(page = 1, limit = 10, role = null) {
    const criteria = role ? { role } : {};
    return paginate(User, page, limit, criteria);
  }

  async getUsersByRole(role) {
    const userRepo = getRepository(User);
    return userRepo.find({
      where: { role },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'isActive', 'createdAt']
    });
  }

  async activateUser(id) {
    return updateEntity(User, id, { isActive: true });
  }

  async deactivateUser(id) {
    return updateEntity(User, id, { isActive: false });
  }

  async getUserStats() {
    const userRepo = getRepository(User);
    
    const totalUsers = await userRepo.count();
    const admins = await userRepo.countBy({ role: 'ADMIN' });
    const staff = await userRepo.countBy({ role: 'LAB_STAFF' });
    const customers = await userRepo.countBy({ role: 'CUSTOMER' });

    return {
      totalUsers,
      admins,
      staff,
      customers
    };
  }
}
