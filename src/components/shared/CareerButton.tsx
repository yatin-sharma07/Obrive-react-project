import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface CareerButtonProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
}

export function CareerButton({
  href,
  children = "Apply For Job",
  className = "",
}: CareerButtonProps) {
  return (
    <Link
      href={href}
      className={`${buttonVariants({
        variant: "default",
        size: "lg",
      })} ${className} inline-flex items-center justify-center gap-2 w-fit !text-white`}
    >
      <span className="!text-white leading-none uppercase text-[10px]">{children}</span>
      <ArrowRight className="w-4 h-4 text-white" />
    </Link>
  );
}
