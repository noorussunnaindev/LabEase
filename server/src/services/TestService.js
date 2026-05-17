import { Test } from '../entities/Test.js';
import { Category } from '../entities/Category.js';
import { getRepository, createEntity, findEntity, findAllEntities, updateEntity, deleteEntity, paginate } from '../utils/database.js';
import { AppError } from '../middleware/errorHandler.js';

export class TestService {
  async createTest(testData) {
    const repository = getRepository(Test);
    const categoryRepo = getRepository(Category);

    const category = await categoryRepo.findOne({ where: { id: testData.categoryId } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return createEntity(Test, testData);
  }

  async getTests(page = 1, limit = 10, categoryId = null) {
    const criteria = categoryId ? { categoryId, isActive: true } : { isActive: true };
    return paginate(Test, page, limit, criteria);
  }

  async getTestById(id) {
    const repository = getRepository(Test);
    return repository.findOne({
      where: { id },
      relations: ['category']
    });
  }

  async searchTests(query) {
    const repository = getRepository(Test);
    return repository
      .createQueryBuilder('test')
      .leftJoinAndSelect('test.category', 'category')
      .where('LOWER(test.testName) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(test.description) LIKE LOWER(:query)', { query: `%${query}%` })
      .andWhere('test.isActive = :isActive', { isActive: true })
      .orderBy('test.createdAt', 'DESC')
      .getMany();
  }

  async updateTest(id, data) {
    const test = await findEntity(Test, { id });
    return updateEntity(Test, id, data);
  }

  async deleteTest(id) {
    return deleteEntity(Test, id);
  }

  async getTestsByCategory(categoryId) {
    return findAllEntities(Test, { categoryId, isActive: true }, ['category']);
  }
}
