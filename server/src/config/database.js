import { DataSource } from 'typeorm';

import { User } from '../entities/User.js';
import { Test } from '../entities/Test.js';
import { Category } from '../entities/Category.js';
import { Booking } from '../entities/Booking.js';
import { BookingTest } from '../entities/BookingTest.js';
import { Report } from '../entities/Report.js';
import { Invoice } from '../entities/Invoice.js';
import { Payment } from '../entities/Payment.js';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const AppDataSource = new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  synchronize: process.env.NODE_ENV !== 'production',

  logging: process.env.NODE_ENV === 'development',

  entities: [
    User,
    Test,
    Category,
    Booking,
    BookingTest,
    Report,
    Invoice,
    Payment,
  ],

  migrations: [],

  subscribers: [],
});