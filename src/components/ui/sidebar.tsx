"use client";

import React from "react";

export const SidebarProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <div className="relative">{children}</div>;
};

export const SidebarTrigger: React.FC<
  React.HTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...rest }) => (
  <button
    {...rest}
    className={["inline-flex items-center", className]
      .filter(Boolean)
      .join(" ")}
  >
    {children ?? <span className="sr-only">Toggle sidebar</span>}
  </button>
);

export const Sidebar: React.FC<
  React.PropsWithChildren<{ collapsible?: string; className?: string }>
> = ({ children, className }) => (
  <aside
    className={["w-72 bg-white border-r border-slate-100 h-screen", className]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </aside>
);

export const SidebarHeader: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["px-4 py-3 border-b", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export const SidebarContent: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["px-3 py-4", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export const SidebarFooter: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <div className={["px-3 py-4 border-t", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);

export const SidebarMenu: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <ul className={["space-y-1", className].filter(Boolean).join(" ")}>
    {children}
  </ul>
);

export const SidebarMenuItem: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => (
  <li className={["block", className].filter(Boolean).join(" ")}>{children}</li>
);

export const SidebarMenuButton: React.FC<
  React.PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
  >
> = ({ children, className, asChild, ...rest }) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: [className, (children as any).props.className]
        .filter(Boolean)
        .join(" "),
    });
  }
  return (
    <button
      {...rest}
      className={[
        "w-full text-left flex items-center gap-2 px-2 py-2 rounded-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
};
