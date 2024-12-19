"use client";

import React, { useState } from "react";
import Logo, { LogoMobile } from "./logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherButton } from "./themeSwitcherButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
};

const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transaction" },
  { label: "Manage", link: "/manage" },
];
function DesktopNavbar() {
  return (
    <div className=" hidden m-auto! border-separate border-b bg-background md:block">
      <nav className=" m-auto !important container flex items-center justify-between px-8 ">
        <div className=" flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className=" flex h-full">
            {items.map((item) => (
              <NavbarItem
                link={item.link}
                label={item.label}
                key={item.label}
              />
            ))}
          </div>
        </div>
        <div className=" flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}
function MobileNavbar() {
  const [isopen, setIsOpen] = useState(false);
  return (
    <div className=" block border-separate bg-background md:hidden">
      <nav className=" container mx-auto!  flex items-center justify-between px-8">
        <Sheet open={isopen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className=" w-[400px] sm:w-[540px] " side="left">
            <Logo />
            <div className=" flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  link={item.link}
                  label={item.label}
                  key={item.label}
                  onClickCall={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className=" flex h-[80px[ min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className=" flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({
  link,
  label,
  onClickCall,
}: {
  link: string;
  label: string;
  onClickCall?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className=" relative flex items-center  ">
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          " w-full  justify-start text-lg text-muted-foreground  hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (onClickCall) onClickCall();
        }}
      >
        {label}
        {isActive && (
          <div className=" absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl md:block bg-foreground"></div>
        )}
      </Link>
    </div>
  );
}
export default Navbar;
