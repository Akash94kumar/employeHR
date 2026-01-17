# Database Models Documentation

## Overview

### WHAT
Database models and schemas for the HR Management Portal.

### WHY
Models define the data structure and relationships for all entities in the system.

### HOW
Mongoose schemas with TypeScript interfaces for type safety.

## Models Created

### 1. User Model (Existing)
**Location**: `apps/backend/src/modules/auth/auth.model.ts`

**Purpose**: Authentication and authorization

**Fields**:
- `email` (unique, indexed)
- `password` (hashed)
- `role` (SUPER_ADMIN, HR, MANAGER, EMPLOYEE)
- `isActive` (soft delete)
- `refreshToken` (for JWT refresh)

**Relationships**: Referenced by Employee model

---

### 2. Employee Model (NEW)
**Location**: `apps/backend/src/modules/employee/employee.model.ts`

**Purpose**: Employee-specific information beyond authentication

**Fields**:
- `userId` (reference to User)
- `employeeId` (unique identifier, e.g., EMP001)
- `firstName`, `lastName`
- `phoneNumber`
- `dateOfBirth`
- `joiningDate`
- `department` (string)
- `designation`
- `managerId` (self-reference to Employee)
- `salary`
- `address` (nested object)
- `emergencyContact` (nested object)
- `isActive` (soft delete)

**Relationships**:
- References User (userId)
- Self-references Employee (managerId)
- Referenced by Department (headId)
- Referenced by Leave (employeeId)

**Indexes**:
- `userId` (unique)
- `employeeId` (unique)
- `department + isActive` (compound)

---

### 3. Department Model (NEW)
**Location**: `apps/backend/src/modules/department/department.model.ts`

**Purpose**: Organizational departments

**Fields**:
- `name` (unique)
- `code` (unique, uppercase, e.g., "ENG", "HR")
- `description`
- `headId` (reference to Employee)
- `budget`
- `isActive` (soft delete)

**Relationships**:
- References Employee (headId)

**Indexes**:
- `name` (unique)
- `code` (unique)

---

### 4. Leave Model (NEW)
**Location**: `apps/backend/src/modules/leave/leave.model.ts`

**Purpose**: Employee leave requests and records

**Fields**:
- `employeeId` (reference to Employee)
- `leaveType` (SICK_LEAVE, CASUAL_LEAVE, EARNED_LEAVE, etc.)
- `startDate`, `endDate`
- `numberOfDays`
- `reason`
- `status` (PENDING, APPROVED, REJECTED, CANCELLED)
- `approvedBy` (reference to User)
- `approvedAt`
- `rejectionReason`

**Relationships**:
- References Employee (employeeId)
- References User (approvedBy)

**Indexes**:
- `employeeId + status` (compound)
- `startDate + endDate` (for date range queries)

---

## Database Tables/Collections

### MongoDB Collections Created:

1. **users** (existing)
   - User authentication data

2. **employees** (NEW)
   - Employee information

3. **departments** (NEW)
   - Department information

4. **leaves** (NEW)
   - Leave requests and records

---

## Seed Data

### Seed Scripts

1. **Basic Seed** (`seed.ts`)
   - Creates users only (all roles)
   - Run: `npm run seed`

2. **Comprehensive Seed** (`seed-all.ts`) (NEW)
   - Creates users, employees, departments, leaves
   - Run: `npm run seed:all`

### Seed Data Includes:

**Users** (6 users):
- 1 SUPER_ADMIN
- 1 HR
- 1 MANAGER
- 3 EMPLOYEES

**Departments** (5 departments):
- Engineering (ENG)
- Human Resources (HR)
- Sales (SALES)
- Marketing (MKT)
- Finance (FIN)

**Employees** (4 employees):
- 1 Manager (Engineering)
- 3 Employees (Engineering, Sales, HR)

**Leaves** (3 leave records):
- Mix of approved and pending leaves
- Different leave types

---

## Relationships Diagram

```
User (1) ──< (1) Employee
                │
                ├──> (1) Department (headId)
                │
                └──> (*) Leave
                       │
                       └──> (1) User (approvedBy)
```

---

## Usage

### Run Basic Seed (Users Only)
```bash
cd apps/backend
npm run seed
```

### Run Comprehensive Seed (All Data)
```bash
cd apps/backend
npm run seed:all
```

### Access Seed Data

**Login Credentials** (all use password: `password123`):
- `admin@hrportal.com` (SUPER_ADMIN)
- `hr@hrportal.com` (HR)
- `manager@hrportal.com` (MANAGER)
- `employee1@hrportal.com` (EMPLOYEE)
- `employee2@hrportal.com` (EMPLOYEE)
- `employee3@hrportal.com` (EMPLOYEE)

---

## Future Models (To Be Created)

1. **Attendance Model**
   - Employee attendance records
   - Check-in/check-out times
   - Work hours

2. **Performance Review Model**
   - Performance evaluations
   - Ratings and feedback
   - Review cycles

3. **Payroll Model**
   - Salary records
   - Deductions
   - Tax information

4. **Document Model**
   - Employee documents
   - Contracts
   - Certificates

---

**Last Updated**: Database models implementation  
**Maintained By**: Backend Team

