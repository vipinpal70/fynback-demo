import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children?: ReactNode;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  [key: string]: any;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    const pathname = usePathname() || "";
    const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(
          typeof className === "function" 
            ? className({ isActive, isPending: false }) 
            : cn(className, isActive && activeClassName)
        )}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
