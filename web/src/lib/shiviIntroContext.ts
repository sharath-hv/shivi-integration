/** Query keys for Shivi intro deep-linking (e.g. from MMV). */

export const SHIVI_INTRO_CAR_QUERY = "car";
export const SHIVI_INTRO_COLOUR_QUERY = "colour";

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
