"use client";

import React from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { Coffee } from "lucide-react";
import { openExternalUrl } from "@/lib/capacitorUtils";

const BUY_ME_COFFEE_URL = "https://buymeacoffee.com/themountainpathway";

type BuyMeCoffeeLinkProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  text?: string;
  style?: CSSProperties;
  defaultColor?: string;
  hoverColor?: string;
  icon?: ReactNode;
  showText?: boolean;
};

export default function BuyMeCoffeeLink({
  className,
  textClassName,
  iconClassName = "w-4 h-4",
  text = "Buy me a Coffee",
  style,
  defaultColor,
  hoverColor,
  icon,
  showText = true,
}: BuyMeCoffeeLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    void openExternalUrl(BUY_ME_COFFEE_URL);
  };

  const handleMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
    if (hoverColor) {
      event.currentTarget.style.color = hoverColor;
    }
  };

  const handleMouseOut = (event: MouseEvent<HTMLAnchorElement>) => {
    if (defaultColor) {
      event.currentTarget.style.color = defaultColor;
    }
  };

  return (
    <a
      href={BUY_ME_COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      style={style}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {icon ?? <Coffee className={iconClassName} />}
      {showText ? <span className={textClassName}>{text}</span> : null}
    </a>
  );
}
