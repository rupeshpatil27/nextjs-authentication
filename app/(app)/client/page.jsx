"use client";

import UserInfo from "@/components/auth/UserInfo";
import { useCurrentUser } from "@/hook/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <div className="w-full flex justify-center mt-4">
      <UserInfo label="Client Component" user={user} />
    </div>
  );
};

export default ClientPage;
