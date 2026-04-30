import { showroomCars } from "../data/cars";

export type FlowRouteItem = {
  id: string;
  path: string;
  label: string;
  description: string;
};

const sampleCarId = showroomCars[0]?.id ?? "toyota-hyryder";

/** MM overview screen — URL and Shivi `location.state.backPath` target. */
export const MM_OVERVIEW_PATH = "/mm-overview";

/** Prototype: switch between listing and MMV without typing URLs */
export const FLOW_ROUTES: FlowRouteItem[] = [
  {
    id: "showroom",
    path: "/cars",
    label: "Car listing",
    description: "Showroom",
  },
  {
    id: "car-detail",
    path: `/cars/${sampleCarId}`,
    label: "MMV",
    description: "Car details (sample)",
  },
  {
    id: "mm-overview",
    path: MM_OVERVIEW_PATH,
    label: "MM overview",
    description: "Model overview",
  },
];
