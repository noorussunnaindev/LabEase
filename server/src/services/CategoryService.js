import { Category } from '../entities/Category.js';
import { getRepository, createEntity, findEntity, findAllEntities, updateEntity, deleteEntity } from '../utils/database.js';

export class CategoryService {
  async createCategory(data) {
    return createEntity(Category, data);
  }

  async getCategories() {
    const repository = getRepository(Category);
    return repository.find({
      relations: ['tests'],
      order: { createdAt: 'DESC' }
    });
  }

  async getCategoryById(id) {
    const repository = getRepository(Category);
    return repository.findOne({
      where: { id },
      relations: ['tests']
    });
  }

  async updateCategory(id, data) {
    await findEntity(Category, { id });
    return updateEntity(Category, id, data);
  }

  async deleteCategory(id) {
    return deleteEntity(Category, id);
  }
}
