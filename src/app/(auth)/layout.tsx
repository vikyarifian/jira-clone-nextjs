import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;    
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="">
        <Image src="/logo.svg" alt="Logo" width={100} height={50} />
        <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;