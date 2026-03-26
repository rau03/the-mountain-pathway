"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export function StatusBarInitializer() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") {
      return;
    }

    const configureStatusBar = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#d6d3d1" });
      } catch (error) {
        console.error("Failed to configure iOS status bar:", error);
      }
    };

    void configureStatusBar();
  }, []);

  return null;
}
