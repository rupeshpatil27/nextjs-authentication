"use client";

import { useCurrentUser } from "@/hook/use-current-user";

const dashBoard = () => {
  const user = useCurrentUser();

  if (!user) {
    return <div>Please login</div>;
  }

  return <div>dashBoard {JSON.stringify(user)}</div>;
};

export default dashBoard;
