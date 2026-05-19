import { DataSource } from 'typeorm';

import { User } from '../entities/User.js';
import { Test } from '../entities/Test.js';
import { Category } from '../entities/Category.js';
import { Booking } from '../entities/Booking.js';
import { BookingTest } from '../entities/BookingTest.js';
import { Report } from '../entities/Report.js';
import { Invoice } from '../entities/Invoice.js';
import { Payment } from '../entities/Payment.js';

export const AppDataSource = new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST || 'localhost',

  port: parseInt(process.env.DB_PORT || '5432'),

  username: process.env.DB_USERNAME || 'labease_user',

  password: process.env.DB_PASSWORD || 'password',

  database: process.env.DB_DATABASE || 'labease_db',

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