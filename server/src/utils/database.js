import { AppDataSource } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export const getRepository = (entity) => {
  return AppDataSource.getRepository(entity);
};

export const createEntity = async (entity, data) => {
  const repository = getRepository(entity);
  const instance = repository.create(data);
  return repository.save(instance);
};

export const findEntity = async (entity, criteria) => {
  const repository = getRepository(entity);
  const result = await repository.findOne({ where: criteria });
  if (!result) {
    throw new AppError('Resource not found', 404);
  }
  return result;
};

export const findAllEntities = async (entity, criteria = {}, relations = []) => {
  const repository = getRepository(entity);
  return repository.find({
    where: criteria,
    relations,
    order: { createdAt: 'DESC' }
  });
};

export const updateEntity = async (entity, id, data) => {
  const repository = getRepository(entity);
  await repository.update(id, data);
  return repository.findOne({ where: { id } });
};

export const deleteEntity = async (entity, id) => {
  const repository = getRepository(entity);
  await repository.delete(id);
};

export const paginate = async (entity, page = 1, limit = 10, criteria = {}) => {
  const repository = getRepository(entity);
  const skip = (page - 1) * limit;

  const [data, total] = await repository.findAndCount({
    where: criteria,
    skip,
    take: limit,
    order: { createdAt: 'DESC' }
  });

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};
