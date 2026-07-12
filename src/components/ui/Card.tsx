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
      onClick={() => {
        onClick?.();
      }}
      className={`
        bg-white
        rounded-3xl
        p-5
        shadow-sm
        border
        border-slate-100
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}