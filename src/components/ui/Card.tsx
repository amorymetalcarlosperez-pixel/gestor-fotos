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
        card-surface
        rounded-[24px]
        p-5
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}