import { EntitySchema } from 'typeorm';

export const BookingTest = new EntitySchema({
  name: 'BookingTest',
  tableName: 'booking_tests',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    bookingId: {
      type: 'uuid',
      nullable: false,
    },
    testId: {
      type: 'uuid',
      nullable: false,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
  },
  relations: {
    booking: {
      type: 'many-to-one',
      target: 'Booking',
      joinColumn: { name: 'bookingId' },
      onDelete: 'CASCADE',
    },
    test: {
      type: 'many-to-one',
      target: 'Test',
      joinColumn: { name: 'testId' },
      onDelete: 'CASCADE',
    },
  },
});
