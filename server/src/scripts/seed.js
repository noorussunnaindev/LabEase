import 'dotenv/config';
import { AppDataSource } from '../config/database.js';
import { getRepository } from 'typeorm';
import { Category } from '../entities/Category.js';
import { Test } from '../entities/Test.js';
import { User } from '../entities/User.js';
import { hashPassword } from '../utils/helpers.js';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Database connected');

    // Clear existing data
    const categoryRepo = AppDataSource.getRepository(Category);
    const testRepo = AppDataSource.getRepository(Test);
    const userRepo = AppDataSource.getRepository(User);

    // Seed Admin User
    const adminPassword = await hashPassword('admin123');
    const admin = userRepo.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@labease.com',
      password: adminPassword,
      phone: '1234567890',
      role: 'ADMIN',
      isActive: true,
    });
    await userRepo.save(admin);
    console.log('✓ Admin user created');

    // Seed Lab Staff User
    const staffPassword = await hashPassword('staff123');
    const staff = userRepo.create({
      firstName: 'Lab',
      lastName: 'Staff',
      email: 'staff@labease.com',
      password: staffPassword,
      phone: '9876543210',
      role: 'LAB_STAFF',
      isActive: true,
    });
    await userRepo.save(staff);
    console.log('✓ Lab staff user created');

    // Seed Categories
    const categories = [
      { name: 'Blood Tests', description: 'Complete blood work analysis', icon: '🩸' },
      { name: 'Cardiac Tests', description: 'Heart and cardiovascular testing', icon: '❤️' },
      { name: 'COVID-19', description: 'COVID-19 testing and screening', icon: '🦠' },
      { name: 'Diabetes', description: 'Diabetes screening and monitoring', icon: '🩺' },
      { name: 'Thyroid', description: 'Thyroid function tests', icon: '🔬' },
      { name: 'Fertility', description: 'Fertility and hormone testing', icon: '👶' },
    ];

    const savedCategories = [];
    for (const cat of categories) {
      const category = categoryRepo.create(cat);
      const saved = await categoryRepo.save(category);
      savedCategories.push(saved);
    }
    console.log('✓ Categories created');

    // Seed Tests
    const tests = [
      {
        testName: 'Complete Blood Count (CBC)',
        description: 'Complete analysis of blood cells',
        price: 25.00,
        duration: 15,
        preparationInstructions: 'No fasting required',
        categoryId: savedCategories[0].id,
      },
      {
        testName: 'Blood Sugar Test',
        description: 'Fasting blood glucose test',
        price: 15.00,
        duration: 10,
        preparationInstructions: '8-12 hours fasting required',
        categoryId: savedCategories[0].id,
      },
      {
        testName: 'COVID-19 RT-PCR',
        description: 'COVID-19 reverse transcription PCR test',
        price: 50.00,
        duration: 5,
        preparationInstructions: 'No special preparation',
        categoryId: savedCategories[2].id,
      },
      {
        testName: 'COVID-19 Rapid Antigen',
        description: 'COVID-19 rapid antigen detection test',
        price: 25.00,
        duration: 10,
        preparationInstructions: 'No special preparation',
        categoryId: savedCategories[2].id,
      },
      {
        testName: 'ECG',
        description: 'Electrocardiogram for heart health',
        price: 80.00,
        duration: 20,
        preparationInstructions: 'Avoid caffeine 24 hours before',
        categoryId: savedCategories[1].id,
      },
      {
        testName: 'Thyroid Profile',
        description: 'TSH, T3, T4 testing',
        price: 60.00,
        duration: 15,
        preparationInstructions: 'No fasting required',
        categoryId: savedCategories[4].id,
      },
      {
        testName: 'Full Body Checkup',
        description: 'Comprehensive health screening',
        price: 150.00,
        duration: 60,
        preparationInstructions: '8 hours fasting required',
        categoryId: savedCategories[0].id,
      },
      {
        testName: 'Lipid Profile',
        description: 'Cholesterol and triglyceride levels',
        price: 40.00,
        duration: 10,
        preparationInstructions: '12 hours fasting required',
        categoryId: savedCategories[0].id,
      },
      {
        testName: 'Fertility Panel',
        description: 'Complete fertility assessment',
        price: 200.00,
        duration: 30,
        preparationInstructions: 'Consult doctor for timing',
        categoryId: savedCategories[5].id,
      },
      {
        testName: 'Liver Function Test',
        description: 'Assess liver health and function',
        price: 55.00,
        duration: 15,
        preparationInstructions: 'No fasting required',
        categoryId: savedCategories[0].id,
      },
    ];

    for (const test of tests) {
      const t = testRepo.create(test);
      await testRepo.save(t);
    }
    console.log('✓ Tests created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Admin: admin@labease.com / admin123');
    console.log('   Staff: staff@labease.com / staff123');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
