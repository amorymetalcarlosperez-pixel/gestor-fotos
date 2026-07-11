import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
};

export default function Page({
  title,
  subtitle,
  right,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="mx-auto max-w-md min-h-screen">

        <div className="sticky top-0 z-20 bg-slate-100/90 backdrop-blur-lg">

          <div className="px-5 pt-safe pt-6 pb-5">

            <div className="flex items-start justify-between">

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {title}
                </h1>

                {subtitle && (
                  <p className="mt-1 text-slate-500">
                    {subtitle}
                  </p>
                )}

              </div>

              {right}

            </div>

          </div>

        </div>

        <div className="px-4 pb-24 space-y-4">

          {children}

        </div>

      </div>

    </div>
  );
}