"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "@/constants";
import { logoutUser } from "@/lib/actions/user.actions";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import FileUploader from "../FileUploader";
import { Button } from "../ui/button";

type MobileNavProps = {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
};

function MobileNav({ fullName, email, avatar, accountId }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Image
            src="/assets/icons/menu.svg"
            alt="search"
            width={30}
            height={30}
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar || "/public/assets/images/avatar.png"}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="my-5 bg-light-200/20" />
          </SheetTitle>
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ name, icon, url }) => {
                const isActive = pathname === url;
                return (
                  <li key={name} className="lg:w-full">
                    <Link
                      href={url}
                      className={`mobile-nav-item ${isActive && "shad-active"}`}
                    >
                      <Image
                        src={icon}
                        alt={`an icon for the ${name} page`}
                        width={24}
                        height={24}
                        className={`nav-icon ${isActive && "nav-icon-active"}`}
                      />
                      <p>{name}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Separator className="my-5 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader />
            <Button
              type="submit"
              className="sign-out-button"
              onClick={logoutUser}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout logo"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default MobileNav;
