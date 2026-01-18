"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, SidebarLogo } from "@/components/ui/sidebar";
import { IconHome, IconSettings, IconUser } from "@tabler/icons-react";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "/app", icon: <IconHome className="h-5 w-5" /> },
    { label: "Profile", href: "/app/profile", icon: <IconUser className="h-5 w-5" /> },
    { label: "Settings", href: "/app/settings", icon: <IconSettings className="h-5 w-5" /> },
  ];

  return (
    <div className="w-full h-screen flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="h-full">
          <SidebarLogo />
          <div className="flex flex-col gap-2 mt-4">
            {links.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default CoreLayout;
