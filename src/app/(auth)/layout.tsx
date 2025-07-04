"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import path from "path";

interface AuthLayoutProps {
  children: React.ReactNode;    
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname;
  const isSignInPage = path.basename(pathname()) === "sign-in";
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" alt="Logo" width={152} height={56} />
          <Button asChild variant={'secondary'}>
            <Link href={isSignInPage ? "/sign-up" : "/sign-in"}>
              {isSignInPage ? "Sign Up" : "Sign In"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
        
    </div>
  );
};

export default AuthLayout;