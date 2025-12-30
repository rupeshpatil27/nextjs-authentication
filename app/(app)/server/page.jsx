import UserInfo from "@/components/auth/UserInfo";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();

  return (
    <div className="w-full flex justify-center mt-4">
      <UserInfo label="Server Component" user={user} />
    </div>
  );
};

export default ServerPage;
