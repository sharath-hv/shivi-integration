import type { NavigateFunction } from "react-router-dom";
import type { ShiviIntroLocationState } from "../pages/ShiviIntroPage";

/** Shivi landing with bottom “Callback scheduled” strip (no CTAs). */
export function navigateToShiviLandingWithCallbackScheduled(
  navigate: NavigateFunction,
  options: { replace?: boolean; search?: string } = {},
): void {
  navigate(
    { pathname: "/shivi", search: options.search ?? "" },
    {
      replace: options.replace ?? true,
      state: { showCallbackScheduled: true } satisfies ShiviIntroLocationState,
    },
  );
}
