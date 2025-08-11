import { useGetIdentity, usePermissions } from "@refinedev/core";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";  // Ensure Navigate is imported

export const RequireRole = ({ role, fallback = <Navigate to="/" />, children }: { role: string | string[]; fallback?: ReactNode; children: ReactNode }): JSX.Element => {
  const { data: user } = useGetIdentity();
  const { data: permissions } = usePermissions();

  const roles = Array.isArray(role) ? role : [role];

  if (permissions && roles.includes(permissions.toString())) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
