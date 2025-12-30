"use client";

import { logout } from "@/actions/logout";

const SignOutButton = ({ children }) => {
  const onClick = () => {
    logout();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default SignOutButton;
