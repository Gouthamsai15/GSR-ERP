import { ROLES } from "../config/roles";

export const getDefaultRouteForRole = (role: string | null | undefined) => {
  if (role === ROLES.SUPER_ADMIN) {
    return "/super-admin/dashboard";
  }

  if (role === ROLES.PRINCIPAL) {
    return "/principal/dashboard";
  }

  if (role === ROLES.ADMIN) {
    return "/dashboard/home";
  }

  if (role === ROLES.STAFF) {
    return "/dashboard/analytics";
  }

  if (role === ROLES.PARENT) {
    return "/dashboard/attendance";
  }

  if (role === ROLES.STUDENT) {
    return "/dashboard/results";
  }

  return "/login";
};

export const isDashboardLikePath = (pathname: string) =>
  pathname.startsWith("/dashboard") ||
  pathname.startsWith("/super-admin") ||
  pathname.startsWith("/principal");
