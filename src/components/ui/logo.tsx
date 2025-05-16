// components/Logo.tsx
import React from "react";

export function Logo({ size = 24 }: { size?: number }) {
  return (
    <img
      src="/favicon.png"
      alt="NoobsterDSA Logo"
      width={size}
      height={size}
      className="rounded-sm"
    />
  );
}
