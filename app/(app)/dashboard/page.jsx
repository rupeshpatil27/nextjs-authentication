"use client"

import { useSession } from "next-auth/react";

const dashBoard = () => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return <div>Please login</div>;
  }

  return <div>dashBoard {JSON.stringify(session)}</div>;
};

export default dashBoard;
