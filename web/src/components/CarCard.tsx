import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AssetIcon } from "./AssetIcon";
import type { CarListItem } from "../types/car";
import { ASSETS } from "../lib/assets";
import "./car-card.css";

type CarCardProps = {
  car: CarListItem;
  index: number;
  variant?: "default" | "drive";
};

export function CarCard({ car, index, variant = "default" }: CarCardProps) {
  const isDrive = variant === "drive";

  return (
    <motion.article
      className={`car-card${isDrive ? " car-card--drive" : ""}`.trim()}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="car-card__media-wrap">
        <img
          className="car-card__img"
          src={car.imageUrl}
          alt=""
          width={car.imageWidth}
          height={car.imageHeight}
          loading="lazy"
        />
        {car.unavailable ? (
          <div className="car-card__overlay" role="status">
            <span className="car-card__overlay-icon" aria-hidden>
              <InfoIcon />
            </span>
            <span className="car-card__overlay-text">Unavailable for purchase on ACKO Drive</span>
          </div>
        ) : null}
      </div>
      <div className="car-card__body">
        <div className="car-card__rating">
          <AssetIcon src={ASSETS.fullStar} width={12} height={12} className="car-card__rating-star" />
          <span>{car.expertRatingLabel}</span>
        </div>
        <h2 className="car-card__title">{car.name}</h2>
        <p className="car-card__variants">{car.variantSummary}</p>
        {car.deliveryMeta ? (
          <p className={`car-card__meta car-card__meta--delivery${isDrive ? " car-card__meta--delivery-express" : ""}`}>
            {isDrive ? (
              <>
                <span>{car.deliveryMeta}</span>
                <AssetIcon src={ASSETS.expressDelivery} width={16} height={16} className="car-card__meta-icon" />
              </>
            ) : (
              <>
                <AssetIcon src={ASSETS.standardDelivery} width={16} height={16} className="car-card__meta-icon" />
                {car.deliveryMeta}
              </>
            )}
          </p>
        ) : null}
        {car.waitMeta ? (
          <p className={`car-card__meta car-card__meta--wait${isDrive ? " car-card__meta--wait-drive" : ""}`}>
            {car.waitMeta}
            <AssetIcon src={ASSETS.standardDelivery} width={16} height={16} className="car-card__meta-icon" />
          </p>
        ) : null}
        {!car.unavailable ? (
          <>
            <div className="car-card__price-block">
              <p className="car-card__from">{car.fromPriceDisplay}</p>
              <p className="car-card__emi">{car.emiDisplay}</p>
              {isDrive ? <SaveTaglineDrive text={car.saveTagline} /> : <p className="car-card__save">{car.saveTagline}</p>}
            </div>
            <div className="car-card__actions">
              <Link to={`/cars/${car.id}`} className="car-card__btn car-card__btn--ghost">
                View details
              </Link>
              <button type="button" className="car-card__btn car-card__btn--shortlist">
                <AssetIcon src={ASSETS.shortlist} width={24} height={24} className="car-card__shortlist-icon" />
                Shortlist
              </button>
            </div>
          </>
        ) : (
          <div className="car-card__unavailable-actions">
            <div className="car-card__info-row">
              <InfoIcon />
              <span>Unavailable for purchase on ACKO Drive</span>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
}

function SaveTaglineDrive({ text }: { text: string }) {
  const withIdx = text.indexOf(" with ");
  if (withIdx === -1) {
    return <p className="car-card__save car-card__save--drive">{text}</p>;
  }
  return (
    <p className="car-card__save car-card__save--drive">
      <span className="car-card__save-highlight">{text.slice(0, withIdx)}</span>
      <span>{text.slice(withIdx)}</span>
    </p>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 9V14M10 6.5V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
