"use client";

import { navItems } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  fullName: string;
  email: string;
  avatar: string;
};

function Sidebar({ fullName, email, avatar }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-brand.svg"
          alt="Logo"
          width={52}
          height={52}
          className="lg:hidden h-auto"
        />
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="Logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, url, icon }) => {
            const isActive = pathname === url;
            return (
              <li key={name} className="lg:w-full">
                <Link
                  href={url}
                  className={`sidebar-nav-item ${isActive && "shad-active"}`}
                >
                  <Image
                    src={icon}
                    alt={`an icon for the ${name} page`}
                    width={24}
                    height={24}
                    className={`nav-icon ${isActive && "nav-icon-active"}`}
                  />
                  <p className="hidden lg:block">{name}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={380}
        height={314}
        className="w-full h-auto"
      />
      <div className="sidebar-user-info">
        <Image
          src={avatar || "/assets/images/avatar.png"}
          alt="User Avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
