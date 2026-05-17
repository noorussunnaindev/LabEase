import { EntitySchema } from 'typeorm';

export const Invoice = new EntitySchema({
  name: 'Invoice',
  tableName: 'invoices',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    invoiceNumber: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    bookingId: {
      type: 'uuid',
      unique: true,
      nullable: false,
    },
    subtotal: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tax: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
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
    invoiceDate: {
      type: 'date',
      nullable: false,
    },
    dueDate: {
      type: 'date',
      nullable: true,
    },
    pdfUrl: {
      type: 'varchar',
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
    booking: {
      type: 'one-to-one',
      target: 'Booking',
      joinColumn: { name: 'bookingId' },
      onDelete: 'CASCADE',
    },
  },
});
