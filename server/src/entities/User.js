import { EntitySchema } from 'typeorm';
import { ROLES } from '../constants/index.js';

export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    firstName: {
      type: 'varchar',
      nullable: false,
    },
    lastName: {
      type: 'varchar',
      nullable: false,
    },
    email: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    password: {
      type: 'varchar',
      nullable: false,
    },
    phone: {
      type: 'varchar',
      nullable: true,
    },
    role: {
      type: 'varchar',
      default: ROLES.CUSTOMER,
    },
    address: {
      type: 'text',
      nullable: true,
    },
    city: {
      type: 'varchar',
      nullable: true,
    },
    state: {
      type: 'varchar',
      nullable: true,
    },
    pincode: {
      type: 'varchar',
      nullable: true,
    },
    profilePicture: {
      type: 'varchar',
      nullable: true,
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
    bookings: {
      type: 'one-to-many',
      target: 'Booking',
      inverseSide: 'user',
    },
    payments: {
      type: 'one-to-many',
      target: 'Payment',
      inverseSide: 'user',
    },
  },
});
