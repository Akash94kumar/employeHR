/**
 * WHAT: Comprehensive database seed script
 * 
 * WHY: Provides initial data for all modules (users, employees, departments, leaves).
 * Creates realistic test data for development and testing.
 * 
 * HOW: Run with: npx tsx src/scripts/seed-all.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../modules/auth/auth.model';
import { UserRole } from '../modules/auth/auth.types';
import { Employee } from '../modules/employee/employee.model';
import { Department } from '../modules/department/department.model';
import { Leave, LeaveStatus, LeaveType } from '../modules/leave/leave.model';
import env from '../config/env';

/**
 * WHAT: Seed all data function
 * 
 * WHY: Creates comprehensive test data for all modules.
 * 
 * HOW: Connects to MongoDB, creates data in order, then disconnects
 */
async function seedAll() {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');

    // WHY: Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // WHY: Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await Leave.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // WHY: Hash password once for all users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // ============================================
    // 1. CREATE USERS
    // ============================================
    console.log('👤 Creating users...');
    const users = [
      {
        email: 'admin@hrportal.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
      {
        email: 'hr@hrportal.com',
        password: hashedPassword,
        role: UserRole.HR,
        isActive: true,
      },
      {
        email: 'manager@hrportal.com',
        password: hashedPassword,
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        email: 'employee1@hrportal.com',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
      {
        email: 'employee2@hrportal.com',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
      {
        email: 'employee3@hrportal.com',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // WHY: Map users by role for easy reference
    const adminUser = createdUsers.find((u) => u.role === UserRole.SUPER_ADMIN)!;
    const hrUser = createdUsers.find((u) => u.role === UserRole.HR)!;
    const managerUser = createdUsers.find((u) => u.role === UserRole.MANAGER)!;
    const employeeUsers = createdUsers.filter((u) => u.role === UserRole.EMPLOYEE);

    // ============================================
    // 2. CREATE DEPARTMENTS
    // ============================================
    console.log('\n🏢 Creating departments...');
    const departments = [
      {
        name: 'Engineering',
        code: 'ENG',
        description: 'Software development and engineering',
        isActive: true,
      },
      {
        name: 'Human Resources',
        code: 'HR',
        description: 'HR operations and employee management',
        isActive: true,
      },
      {
        name: 'Sales',
        code: 'SALES',
        description: 'Sales and business development',
        isActive: true,
      },
      {
        name: 'Marketing',
        code: 'MKT',
        description: 'Marketing and communications',
        isActive: true,
      },
      {
        name: 'Finance',
        code: 'FIN',
        description: 'Finance and accounting',
        isActive: true,
      },
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    const engDept = createdDepartments.find((d) => d.code === 'ENG')!;
    const hrDept = createdDepartments.find((d) => d.code === 'HR')!;
    const salesDept = createdDepartments.find((d) => d.code === 'SALES')!;

    // ============================================
    // 3. CREATE EMPLOYEES
    // ============================================
    console.log('\n👔 Creating employees...');
    const employees = [
      {
        userId: managerUser._id,
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Manager',
        phoneNumber: '+1234567890',
        joiningDate: new Date('2023-01-15'),
        department: engDept.name,
        designation: 'Engineering Manager',
        salary: 120000,
        address: {
          street: '123 Tech Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA',
        },
        isActive: true,
      },
      {
        userId: employeeUsers[0]._id,
        employeeId: 'EMP002',
        firstName: 'Alice',
        lastName: 'Developer',
        phoneNumber: '+1234567891',
        joiningDate: new Date('2023-03-20'),
        department: engDept.name,
        designation: 'Senior Software Engineer',
        salary: 95000,
        managerId: null, // WHY: Will be set after manager employee is created
        isActive: true,
      },
      {
        userId: employeeUsers[1]._id,
        employeeId: 'EMP003',
        firstName: 'Bob',
        lastName: 'Designer',
        phoneNumber: '+1234567892',
        joiningDate: new Date('2023-05-10'),
        department: salesDept.name,
        designation: 'Sales Executive',
        salary: 75000,
        isActive: true,
      },
      {
        userId: employeeUsers[2]._id,
        employeeId: 'EMP004',
        firstName: 'Carol',
        lastName: 'Analyst',
        phoneNumber: '+1234567893',
        joiningDate: new Date('2023-07-01'),
        department: hrDept.name,
        designation: 'HR Analyst',
        salary: 70000,
        isActive: true,
      },
    ];

    const createdEmployees = await Employee.insertMany(employees);
    console.log(`✅ Created ${createdEmployees.length} employees`);

    // WHY: Set manager references after employees are created
    const managerEmployee = createdEmployees.find((e) => e.employeeId === 'EMP001')!;
    const aliceEmployee = createdEmployees.find((e) => e.employeeId === 'EMP002')!;
    aliceEmployee.managerId = managerEmployee._id;
    await aliceEmployee.save();

    // WHY: Update department heads
    engDept.headId = managerEmployee._id;
    await engDept.save();

    // ============================================
    // 4. CREATE LEAVES
    // ============================================
    console.log('\n🏖️  Creating leave records...');
    const leaves = [
      {
        employeeId: aliceEmployee._id,
        leaveType: LeaveType.SICK_LEAVE,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-16'),
        numberOfDays: 2,
        reason: 'Fever and cold',
        status: LeaveStatus.APPROVED,
        approvedBy: hrUser._id,
        approvedAt: new Date('2024-01-10'),
      },
      {
        employeeId: aliceEmployee._id,
        leaveType: LeaveType.CASUAL_LEAVE,
        startDate: new Date('2024-02-20'),
        endDate: new Date('2024-02-22'),
        numberOfDays: 3,
        reason: 'Personal work',
        status: LeaveStatus.PENDING,
      },
      {
        employeeId: createdEmployees.find((e) => e.employeeId === 'EMP003')!._id,
        leaveType: LeaveType.EARNED_LEAVE,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-05'),
        numberOfDays: 5,
        reason: 'Vacation',
        status: LeaveStatus.APPROVED,
        approvedBy: managerUser._id,
        approvedAt: new Date('2024-02-25'),
      },
    ];

    const createdLeaves = await Leave.insertMany(leaves);
    console.log(`✅ Created ${createdLeaves.length} leave records`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Departments: ${createdDepartments.length}`);
    console.log(`   Employees: ${createdEmployees.length}`);
    console.log(`   Leaves: ${createdLeaves.length}`);

    console.log('\n📝 Login Credentials:');
    console.log('   SUPER_ADMIN: admin@hrportal.com | password123');
    console.log('   HR: hr@hrportal.com | password123');
    console.log('   MANAGER: manager@hrportal.com | password123');
    console.log('   EMPLOYEE 1: employee1@hrportal.com | password123');
    console.log('   EMPLOYEE 2: employee2@hrportal.com | password123');
    console.log('   EMPLOYEE 3: employee3@hrportal.com | password123');

    // WHY: Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// WHY: Run seed function
seedAll();

