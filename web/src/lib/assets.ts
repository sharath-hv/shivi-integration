import { publicUrl } from "./publicUrl";

/** Static assets served from /public/assets (copied from repo /assets). */
export const ASSETS = {
  filter: publicUrl("/assets/Filter.svg"),
  search: publicUrl("/assets/Search.svg"),
  location: publicUrl("/assets/location.svg"),
  fullStar: publicUrl("/assets/full_star.svg"),
  expressDelivery: publicUrl("/assets/express-delivery.svg"),
  standardDelivery: publicUrl("/assets/standard-delivery.svg"),
  shortlist: publicUrl("/assets/Shortlist.svg"),
  shiviAvatar: publicUrl("/assets/Shivi_small.png"),
  onlineIndicator: publicUrl("/assets/online-indicator.svg"),
  shiviTileCarPrice: publicUrl("/assets/shivi-tile-car-price.svg"),
  shiviTileCompareCars: publicUrl("/assets/shivi-tile-compare-cars.svg"),
  shiviTileCarFinance: publicUrl("/assets/shivi-tile-car-finance.svg"),
  shiviTileAnswerQuestions: publicUrl("/assets/shivi-tile-answer-questions.svg"),
  /** Shivi call success — Figma 253-11086 */
  success: publicUrl("/assets/Success.svg"),
  /** Locked / masked price — repo /assets/Lock.svg */
  lock: publicUrl("/assets/Lock.svg"),
  /** MMV hero car — Figma 253-12803 */
  mmvCar: publicUrl("/assets/mmv-car.png"),
  /** Call summary — Figma 348:1547 (Claim / document icon) */
  callSummary: publicUrl("/assets/summary.svg"),
} as const;
