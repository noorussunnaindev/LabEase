import { EntitySchema } from 'typeorm';

export const Test = new EntitySchema({
  name: 'Test',
  tableName: 'tests',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    testName: {
      type: 'varchar',
      nullable: false,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    duration: {
      type: 'int',
      comment: 'Duration in minutes',
      nullable: false,
    },
    preparationInstructions: {
      type: 'text',
      nullable: true,
    },
    categoryId: {
      type: 'uuid',
      nullable: false,
    },
    isActive: {
      type: 'boolean',
      default: true,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: { name: 'categoryId' },
      onDelete: 'CASCADE',
    },
    bookingTests: {
      type: 'one-to-many',
      target: 'BookingTest',
      inverseSide: 'test',
    },
  },
});
