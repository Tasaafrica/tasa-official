import React from "react";

export const NavMain: React.FC<{ items: Array<any>; className?: string }> = ({
  items,
  className,
}) => {
  return (
    <nav className={className}>
      <ul className="space-y-2">
        {items.map((item: any, idx: number) => (
          <li key={idx}>
            {item.items ? (
              <div className="py-1">
                <div className="text-xs text-slate-500 font-semibold px-2">
                  {item.title}
                </div>
                <ul className="pl-4">
                  {item.items.map((it: any, i: number) => (
                    <li key={i} className="py-1">
                      <a href={it.url} className="text-sm text-slate-700">
                        {it.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a
                href={item.url}
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-slate-100"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="text-sm font-semibold">{item.title}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMain;
