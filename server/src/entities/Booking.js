import { EntitySchema } from 'typeorm';
import { BOOKING_STATUS, BOOKING_TYPE } from '../constants/index.js';

export const Booking = new EntitySchema({
  name: 'Booking',
  tableName: 'bookings',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    bookingNumber: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    userId: {
      type: 'uuid',
      nullable: false,
    },
    status: {
      type: 'varchar',
      default: BOOKING_STATUS.BOOKED,
    },
    bookingType: {
      type: 'varchar',
      default: BOOKING_TYPE.LAB_VISIT,
    },
    appointmentDate: {
      type: 'date',
      nullable: false,
    },
    appointmentTime: {
      type: 'time',
      nullable: false,
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
    totalAmount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    paymentStatus: {
      type: 'varchar',
      default: 'PENDING',
    },
    notes: {
      type: 'text',
      nullable: true,
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
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'userId' },
      onDelete: 'CASCADE',
    },
    bookingTests: {
      type: 'one-to-many',
      target: 'BookingTest',
      inverseSide: 'booking',
    },
    report: {
      type: 'one-to-one',
      target: 'Report',
      inverseSide: 'booking',
    },
    invoice: {
      type: 'one-to-one',
      target: 'Invoice',
      inverseSide: 'booking',
    },
    payment: {
      type: 'one-to-one',
      target: 'Payment',
      inverseSide: 'booking',
    },
  },
});
