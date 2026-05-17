import { EntitySchema } from 'typeorm';

export const Report = new EntitySchema({
  name: 'Report',
  tableName: 'reports',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    bookingId: {
      type: 'uuid',
      unique: true,
      nullable: false,
    },
    reportFile: {
      type: 'varchar',
      nullable: true,
    },
    fileUrl: {
      type: 'varchar',
      nullable: true,
    },
    isReady: {
      type: 'boolean',
      default: false,
    },
    readyDate: {
      type: 'timestamp',
      nullable: true,
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
    booking: {
      type: 'one-to-one',
      target: 'Booking',
      joinColumn: { name: 'bookingId' },
      onDelete: 'CASCADE',
    },
  },
});
