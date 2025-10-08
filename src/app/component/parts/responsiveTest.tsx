"use client";
import { useState, useEffect } from "react";

export default function ResponsiveTest() {
  const [screenSize, setScreenSize] = useState("");

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize("Mobile (< 640px)");
      } else if (width < 768) {
        setScreenSize("Small (640px - 767px)");
      } else if (width < 1024) {
        setScreenSize("Medium (768px - 1023px)");
      } else if (width < 1280) {
        setScreenSize("Large (1024px - 1279px)");
      } else if (width < 1536) {
        setScreenSize("XL (1280px - 1535px)");
      } else {
        setScreenSize("2XL (1536px+)");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50">
      <div className="font-medium">Screen: {screenSize}</div>
      <div className="text-xs opacity-75">
        {typeof window !== "undefined" && `${window.innerWidth}px`}
      </div>
    </div>
  );
}
