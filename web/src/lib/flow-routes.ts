import { showroomCars } from "../data/cars";

export type FlowRouteItem = {
  id: string;
  path: string;
  label: string;
  description: string;
};

const sampleCarId = showroomCars[0]?.id ?? "toyota-hyryder";

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
];
