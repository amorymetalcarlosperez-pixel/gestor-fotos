import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Card({
  children,
  onClick,
  className = "",
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-3xl
        p-5
        shadow-sm
        border
        border-slate-100
        active:scale-[0.98]
        transition-all
        duration-150
        ${onClick ? "cursor-pointer hover:shadow-md" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}