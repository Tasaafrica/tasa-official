import { Separator as SeparatorPrimitive } from "@/app/component/assest/separator";

interface SeparatorProps {
  className?: string;
  margin?: string;
  width?: string;
  color?: string;
}

export default function Separator({
  className = "",
  margin = "my-1",
  width = "w-full ",
  color = "bg-gray-200",
}: SeparatorProps) {
  return (
    <div
      className={`${width} container mx-auto px-6 sm:px-8 md:px-10 lg:px-16`}
    >
      <SeparatorPrimitive className={`${margin} ${color} ${className} w-50%`} />
    </div>
  );
}
