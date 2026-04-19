import React from "react";

export const NavUser: React.FC<{
  user: { name?: string; email?: string; avatar?: string };
  className?: string;
}> = ({ user, className }) => (
  <div
    className={["flex items-center gap-3", className].filter(Boolean).join(" ")}
  >
    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        (user.name || "U").charAt(0)
      )}
    </div>
    <div className="flex-1">
      <div className="text-sm font-semibold">{user.name}</div>
      <div className="text-xs text-slate-500">{user.email}</div>
    </div>
  </div>
);

export default NavUser;
