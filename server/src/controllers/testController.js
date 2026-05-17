import { TestService } from '../services/TestService.js';
import { AppError } from '../middleware/errorHandler.js';

const testService = new TestService();

export const createTest = async (req, res, next) => {
  try {
    const { testName, description, price, duration, preparationInstructions, categoryId } = req.body;

    if (!testName || !price || !duration || !categoryId) {
      throw new AppError('Missing required fields', 400);
    }

    const test = await testService.createTest({
      testName,
      description,
      price: parseFloat(price),
      duration: parseInt(duration),
      preparationInstructions,
      categoryId
    });

    res.status(201).json({
      success: true,
      data: test,
      message: 'Test created successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categoryId = req.query.categoryId || null;

    const result = await testService.getTests(page, limit, categoryId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = await testService.getTestById(id);

    if (!test) {
      throw new AppError('Test not found', 404);
    }

    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    next(error);
  }
};

export const searchTests = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new AppError('Search query required', 400);
    }

    const tests = await testService.searchTests(query);

    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    next(error);
  }
};

export const updateTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = await testService.updateTest(id, req.body);

    res.status(200).json({
      success: true,
      data: test,
      message: 'Test updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await testService.deleteTest(id);

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTestsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const tests = await testService.getTestsByCategory(categoryId);

    res.status(200).json({
      success: true,
      data: tests
    });
  } catch (error) {
    next(error);
  }
};
