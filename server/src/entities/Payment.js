import { EntitySchema } from 'typeorm';

export const Payment = new EntitySchema({
  name: 'Payment',
  tableName: 'payments',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    bookingId: {
      type: 'uuid',
      unique: true,
      nullable: true,
    },
    userId: {
      type: 'uuid',
      nullable: false,
    },
    amount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    status: {
      type: 'varchar',
      default: 'PENDING',
    },
    paymentMethod: {
      type: 'varchar',
      default: 'STRIPE',
    },
    stripeSessionId: {
      type: 'varchar',
      nullable: true,
      unique: true,
    },
    stripePaymentIntentId: {
      type: 'varchar',
      nullable: true,
      unique: true,
    },
    transactionId: {
      type: 'varchar',
      nullable: true,
      unique: true,
    },
    description: {
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
    booking: {
      type: 'one-to-one',
      target: 'Booking',
      joinColumn: { name: 'bookingId' },
      onDelete: 'CASCADE',
    },
  },
});
