"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function HeaderActions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-4">
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "w-9 h-9 border border-gray-100 shadow-sm"
          }
        }}
      />
    </div>
  );
}
