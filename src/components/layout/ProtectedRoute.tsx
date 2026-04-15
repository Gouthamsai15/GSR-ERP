import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { ROLES } from "../../config/roles";
import LaunchScreen from "../launch/LaunchScreen";

export const ProtectedRoute = () => {
  const { user, loading, role, school } = authStore();
  const location = useLocation();

  if (loading) {
    return <LaunchScreen status="Loading" />;
  }

  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (
    role !== ROLES.SUPER_ADMIN &&
    (school?.subscriptionStatus === "Expired" || school?.subscriptionStatus === "Suspended") &&
    location.pathname !== "/subscription-expired"
  ) {
    return <Navigate to="/subscription-expired" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
