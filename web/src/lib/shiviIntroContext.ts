/** Query keys for Shivi intro deep-linking (e.g. from MMV). */

export const SHIVI_INTRO_CAR_QUERY = "car";
export const SHIVI_INTRO_COLOUR_QUERY = "colour";

/** Router `location.state` for `/shivi` and pages that forward Shivi flow context. */
export type ShiviIntroLocationState = {
  showCallbackScheduled?: boolean;
  /** When set, Shivi intro back navigates here (e.g. MM overview entry). */
  backPath?: string;
};

/** Carry `backPath` when navigating between Shivi steps (state is not merged by default). */
export function pickShiviBackPathState(
  state: unknown,
): Pick<ShiviIntroLocationState, "backPath"> | undefined {
  if (!state || typeof state !== "object") {
    return undefined;
  }
  const bp = (state as ShiviIntroLocationState).backPath;
  if (typeof bp === "string" && bp.length > 0) {
    return { backPath: bp };
  }
  return undefined;
}

export function buildShiviIntroSearch(carId: string, colourId: string): string {
  const params = new URLSearchParams();
  params.set(SHIVI_INTRO_CAR_QUERY, carId);
  if (colourId) {
    params.set(SHIVI_INTRO_COLOUR_QUERY, colourId);
  }
  return params.toString();
}

/** Path + search for `/shivi` with car + exterior colour context. */
export function buildShiviIntroPath(carId: string, colourId: string): string {
  return `/shivi?${buildShiviIntroSearch(carId, colourId)}`;
}
