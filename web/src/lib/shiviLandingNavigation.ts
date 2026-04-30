import type { NavigateFunction } from "react-router-dom";
import type { ShiviIntroLocationState } from "./shiviIntroContext";

/** Shivi landing with bottom “Callback scheduled” strip (no CTAs). */
export function navigateToShiviLandingWithCallbackScheduled(
  navigate: NavigateFunction,
  options: { replace?: boolean; search?: string; backPath?: string } = {},
): void {
  const state: ShiviIntroLocationState = {
    showCallbackScheduled: true,
    ...(options.backPath ? { backPath: options.backPath } : {}),
  };
  navigate(
    { pathname: "/shivi", search: options.search ?? "" },
    {
      replace: options.replace ?? true,
      state,
    },
  );
}
