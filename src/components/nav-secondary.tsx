import React from "react";

export const NavSecondary: React.FC<{
  items: Array<any>;
  className?: string;
}> = ({ items, className }) => {
  return (
    <div className={className}>
      <ul className="space-y-2">
        {items.map((item: any, idx: number) => (
          <li key={idx}>
            <a
              href={item.url}
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-100 text-sm text-slate-700"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavSecondary;
