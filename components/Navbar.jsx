"use client";

import React from "react";
import Link from "next/link";

import { Button } from "./ui/button";
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hook/use-current-user";
import { usePathname } from "next/navigation";
import UserButton from "./auth/UserButton";

function Navbar() {
  const user = useCurrentUser();
  const pathname = usePathname();

  const onClick = () => {
    logout();
  };

  return (
    <nav className="p-4 md:p-3 shadow-md bg-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-2">
          <Button
            asChild
            variant={pathname === "/dashboard" ? "default" : "outline"}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/server" ? "default" : "outline"}
          >
            <Link href="/server">Server</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/client" ? "default" : "outline"}
          >
            <Link href="/client">Client</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        </div>

        <UserButton />
      </div>
    </nav>
  );
}

export default Navbar;
