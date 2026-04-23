export type CarColour = {
  id: string;
  name: string;
  swatch: string;
};

export type CarMmvDetail = {
  variantTitle: string;
  specLine: string;
  colours: CarColour[];
  defaultColourId: string;
  cityPriceLabel: string;
  ackoPriceLabel: string;
  ackoPriceDisplay: string;
  dealerPriceDisplay: string;
  saveAmountDisplay: string;
  expressDeliveryLabel: string;
  primaryCtaLabel: string;
  shiviHeadline: string;
  shiviSubline: string;
  shiviCtaLabel: string;
};

export type CarListItem = {
  id: string;
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  expertRatingLabel: string;
  variantSummary: string;
  deliveryMeta: string | null;
  waitMeta: string | null;
  fromPriceDisplay: string;
  emiDisplay: string;
  saveTagline: string;
  unavailable: boolean;
  mmv: CarMmvDetail;
};

export type ShortlistCar = {
  id: string;
  name: string;
  imageUrl: string;
};
