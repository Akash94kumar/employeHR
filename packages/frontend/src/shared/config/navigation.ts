/**
 * WHAT: Navigation configuration for role-based menu items
 *
 * WHY: Config-driven navigation provides:
 * - Single source of truth for menu structure
 * - Easy to add/modify menu items
 * - Type safety with TypeScript
 * - No hardcoded role checks in components
 * - Centralized navigation logic
 *
 * HOW: Array of menu items with role-based access control
 */

import { UserRole } from "@/features/auth/types";

/**
 * WHAT: Navigation menu item interface
 *
 * WHY: Type-safe menu item structure.
 * Ensures all menu items have required properties.
 *
 * HOW: Used in navigation config and Sidebar component
 */
export interface NavigationItem {
  label: string;
  route: string;
  allowedRoles: UserRole[]; // WHY: Array allows multiple roles to access same item
  icon?: string; // WHY: Optional icon for visual enhancement
  children?: NavigationItem[]; // WHY: Optional nested menu items (future expansion)
}

/**
 * WHAT: Navigation menu configuration
 *
 * WHY: Centralized config makes it easy to:
 * - Add new menu items
 * - Change routes
 * - Update role permissions
 * - Maintain consistency
 *
 * HOW: Array of menu items filtered by user role in Sidebar component
 */
export const navigationConfig: NavigationItem[] = [
  // WHY: Dashboard accessible to all authenticated users
  {
    label: "Dashboard",
    route: "/dashboard",
    allowedRoles: [
      UserRole.SUPER_ADMIN,
      UserRole.HR,
      UserRole.EMPLOYEE,
      UserRole.MANAGER,
    ],
    icon: "📊",
  },

  // WHY: HR Management only for SUPER_ADMIN
  {
    label: "HR Management",
    route: "/admin/hr",
    allowedRoles: [UserRole.SUPER_ADMIN],
    icon: "👥",
  },

  // WHY: Reports for SUPER_ADMIN and HR
  {
    label: "Reports",
    route: "/admin/reports",
    allowedRoles: [UserRole.SUPER_ADMIN, UserRole.HR],
    icon: "📈",
  },

  // WHY: Employees management for HR
  {
    label: "Employees",
    route: "/hr/employees",
    allowedRoles: [UserRole.HR, UserRole.SUPER_ADMIN],
    icon: "👔",
  },

  // WHY: Attendance for HR
  {
    label: "Attendance",
    route: "/hr/attendance",
    allowedRoles: [UserRole.HR, UserRole.SUPER_ADMIN],
    icon: "⏰",
  },

  // WHY: Leave requests for HR
  {
    label: "Leave Requests",
    route: "/hr/leaves",
    allowedRoles: [UserRole.HR, UserRole.SUPER_ADMIN],
    icon: "🏖️",
  },

  // WHY: Employee profile for employees
  {
    label: "My Profile",
    route: "/employee/profile",
    allowedRoles: [UserRole.EMPLOYEE, UserRole.MANAGER],
    icon: "👤",
  },

  // WHY: Employee attendance for employees
  {
    label: "My Attendance",
    route: "/employee/attendance",
    allowedRoles: [UserRole.EMPLOYEE, UserRole.MANAGER],
    icon: "📅",
  },

  // WHY: Employee leaves for employees
  {
    label: "My Leaves",
    route: "/employee/leaves",
    allowedRoles: [UserRole.EMPLOYEE, UserRole.MANAGER],
    icon: "🌴",
  },
];

/**
 * WHAT: Get navigation items for specific role
 *
 * WHY: Filters menu items based on user role.
 * Prevents unauthorized menu items from appearing.
 *
 * HOW: Filters navigationConfig by allowedRoles array
 */
export function getNavigationItemsForRole(role: UserRole): NavigationItem[] {
  return navigationConfig.filter((item) => item.allowedRoles.includes(role));
}
