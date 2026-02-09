"use client";

import React from "react";

// Import from assets - bundler resolves path correctly for web and Capacitor
import mountainIconSrc from "@/assets/mountain-icon-128.png";

type MountainIconProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
};

const sizeMap = {
  sm: { width: 24, height: 24, className: "w-6 h-6" },
  md: { width: 40, height: 40, className: "w-10 h-10" },
  lg: { width: 64, height: 64, className: "w-16 h-16" },
};

export function MountainIcon({
  size = "md",
  className = "",
  alt = "Mountain Pathway",
}: MountainIconProps) {
  const { width, height, className: sizeClass } = sizeMap[size];
  // Bundler resolves import to correct path for web and Capacitor
  const src =
    typeof mountainIconSrc === "string"
      ? mountainIconSrc
      : (mountainIconSrc as { src: string }).src;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${sizeClass} ${className}`.trim()}
    />
  );
}
