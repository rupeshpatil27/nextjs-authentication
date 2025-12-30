"use client";

import axios from "axios";
import { toast } from "sonner";

import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { userRole } from "@/constants";
import { admin } from "@/actions/admin";

const AdminPage = () => {
  const onApiRouteClick = async () => {
    try {
      const res = await axios.get("/api/admin");

      toast.success("Allowed API Route");
    } catch (error) {
      toast.error("FORBIDDEN API Route");
    }
  };

  const onServerActionClick = async () => {
    try {
      const res = await admin();
      if (res.success) {
        toast.success(res.success);
      }

      if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Error!");
    }
  };

  return (
    <div className="w-full flex justify-center mt-4">
      <Card className="w-150">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Admin</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <RoleGate allowedRole={userRole.ADMIN}>
            <p className="text-sm text-green-500">
              You are allowed to see content
            </p>
          </RoleGate>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only API Route</p>
            <Button onClick={onApiRouteClick}>Click to test</Button>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">Admin-only Server Action</p>
            <Button onClick={onServerActionClick}>Click to test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
