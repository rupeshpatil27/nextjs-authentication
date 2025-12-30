"use client";

import { useCurrentRole } from "@/hook/use-current-role";

const RoleGate = ({ children, allowedRole }) => {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return (
      <p className="text-sm text-red-500">
        You do not have permission to view content
      </p>
    );
  }

  return <>{children}</>;
};

export default RoleGate;
