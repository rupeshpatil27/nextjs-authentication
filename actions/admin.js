"use server";

import { userRole } from "@/constants";
import { currentRole } from "@/lib/auth";

export const admin = async () => {
  const role = await currentRole();

  if (role === userRole.ADMIN) {
    return { success: "Allowed" };
  }
  return { error: "FORBBIDEN" };
};
