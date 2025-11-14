import { UserRole } from '../types';

/**
 * Permission system for role-based access control
 */

// Define available permissions
export enum Permission {
  // Consultant permissions
  VIEW_CONSULTANTS = 'view_consultants',
  CREATE_CONSULTANT = 'create_consultant',
  EDIT_CONSULTANT = 'edit_consultant',
  DELETE_CONSULTANT = 'delete_consultant',

  // Client permissions
  VIEW_CLIENTS = 'view_clients',
  CREATE_CLIENT = 'create_client',
  EDIT_CLIENT = 'edit_client',
  DELETE_CLIENT = 'delete_client',

  // Project permissions
  VIEW_PROJECTS = 'view_projects',
  CREATE_PROJECT = 'create_project',
  EDIT_PROJECT = 'edit_project',
  DELETE_PROJECT = 'delete_project',
  ASSIGN_PROJECT = 'assign_project',

  // User permissions
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  EDIT_USER = 'edit_user',
  DELETE_USER = 'delete_user',

  // Settings permissions
  VIEW_SETTINGS = 'view_settings',
  EDIT_SETTINGS = 'edit_settings',

  // Analytics permissions
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],

  [UserRole.MANAGER]: [
    // Consultants
    Permission.VIEW_CONSULTANTS,
    Permission.CREATE_CONSULTANT,
    Permission.EDIT_CONSULTANT,

    // Clients
    Permission.VIEW_CLIENTS,
    Permission.CREATE_CLIENT,
    Permission.EDIT_CLIENT,

    // Projects
    Permission.VIEW_PROJECTS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.ASSIGN_PROJECT,

    // Analytics
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,

    // Settings
    Permission.VIEW_SETTINGS,
  ],

  [UserRole.CONSULTANT]: [
    // Consultants (view only)
    Permission.VIEW_CONSULTANTS,

    // Clients (view only)
    Permission.VIEW_CLIENTS,

    // Projects (view and edit own)
    Permission.VIEW_PROJECTS,
    Permission.EDIT_PROJECT,

    // Settings
    Permission.VIEW_SETTINGS,
  ],

  [UserRole.CLIENT]: [
    // Projects (view only)
    Permission.VIEW_PROJECTS,

    // Consultants (view only)
    Permission.VIEW_CONSULTANTS,

    // Settings
    Permission.VIEW_SETTINGS,
  ],
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

/**
 * Check if a user has all of the specified permissions
 */
export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[]
): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a role
 */
export const getRolePermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

/**
 * Check if a role can perform an action on a resource
 */
export const canPerformAction = (
  userRole: UserRole,
  action: 'view' | 'create' | 'edit' | 'delete',
  resource: 'consultants' | 'clients' | 'projects' | 'users'
): boolean => {
  const permissionMap: Record<string, Permission> = {
    'view_consultants': Permission.VIEW_CONSULTANTS,
    'create_consultants': Permission.CREATE_CONSULTANT,
    'edit_consultants': Permission.EDIT_CONSULTANT,
    'delete_consultants': Permission.DELETE_CONSULTANT,
    'view_clients': Permission.VIEW_CLIENTS,
    'create_clients': Permission.CREATE_CLIENT,
    'edit_clients': Permission.EDIT_CLIENT,
    'delete_clients': Permission.DELETE_CLIENT,
    'view_projects': Permission.VIEW_PROJECTS,
    'create_projects': Permission.CREATE_PROJECT,
    'edit_projects': Permission.EDIT_PROJECT,
    'delete_projects': Permission.DELETE_PROJECT,
    'view_users': Permission.VIEW_USERS,
    'create_users': Permission.CREATE_USER,
    'edit_users': Permission.EDIT_USER,
    'delete_users': Permission.DELETE_USER,
  };

  const permissionKey = `${action}_${resource}`;
  const permission = permissionMap[permissionKey];

  return permission ? hasPermission(userRole, permission) : false;
};

/**
 * Permission guard for React components
 */
interface PermissionGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  permission: Permission;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  userRole,
  permission,
  fallback = null,
}) => {
  if (!hasPermission(userRole, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook for checking permissions
 */
export const usePermissions = (userRole: UserRole) => {
  return {
    hasPermission: (permission: Permission) => hasPermission(userRole, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(userRole, permissions),
    canPerformAction: (
      action: 'view' | 'create' | 'edit' | 'delete',
      resource: 'consultants' | 'clients' | 'projects' | 'users'
    ) => canPerformAction(userRole, action, resource),
    permissions: getRolePermissions(userRole),
  };
};
