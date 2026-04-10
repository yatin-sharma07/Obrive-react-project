import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function ButtonLink({ href, children, className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 ${className} underline`}
    >
      {children}
    </Link>
  );
}
