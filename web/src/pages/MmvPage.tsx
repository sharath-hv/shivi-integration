import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { getCarById } from "../data/cars";
import { ASSETS } from "../lib/assets";
import { buildShiviIntroPath } from "../lib/shiviIntroContext";
import { formatInrDisplayAsLakh } from "../lib/mmvPriceFormat";
import "./mmv.css";

/** Figma: Shivi AD integration — node 253:12803 (MMVC) */
export function MmvPage() {
  const { carId } = useParams<{ carId: string }>();
  const car = carId ? getCarById(carId) : undefined;

  const colours = car?.mmv.colours ?? [];
  const defaultId = car?.mmv.defaultColourId ?? "";
  const [selectedColourId, setSelectedColourId] = useState(defaultId);

  useEffect(() => {
    if (car) {
      setSelectedColourId(car.mmv.defaultColourId);
    }
  }, [carId, car]);

  const selectedColour = useMemo(() => {
    return colours.find((c) => c.id === selectedColourId) ?? colours[0];
  }, [colours, selectedColourId]);

  if (!car) {
    return (
      <MobileShell className="mobile-shell--mmv">
        <div className="mmv-not-found">
          <h1>Car not found</h1>
          <p>
            <Link to="/cars">Back to showroom</Link>
          </p>
        </div>
      </MobileShell>
    );
  }

  const mmv = car.mmv;
  const displayColour = selectedColour ?? { name: "", id: "", swatch: "" };

  return (
    <MobileShell className="mobile-shell--mmv">
      <div className="mmv">
        <header className="mmv__header">
          <h1 className="mmv__title">{mmv.variantTitle}</h1>
          <p className="mmv__spec">{mmv.specLine}</p>
        </header>

        <div className="mmv__hero">
          <img
            className="mmv__car"
            src={ASSETS.mmvCar}
            alt={`${car.name} ${displayColour.name}`}
            width={218}
            height={120}
          />
        </div>

        <p className="mmv__colour-name">{displayColour.name}</p>

        <div className="mmv__swatches" role="listbox" aria-label="Exterior colour">
          {colours.map((c) => {
            const selected = c.id === displayColour.id;
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={"mmv__swatch" + (selected ? " mmv__swatch--selected" : "")}
                onClick={() => setSelectedColourId(c.id)}
                aria-label={`Colour ${c.name}`}
              >
                <span className="mmv__swatch-fill" style={{ background: c.swatch }} />
                {selected ? (
                  <span className="mmv__swatch-check" aria-hidden>
                    <CheckIcon />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <section className="mmv__price-card" aria-label="Pricing">
          <p className="mmv__price-label">{mmv.cityPriceLabel}</p>
          <div className="mmv__price-row">
            <span className="mmv__price-main">
              {formatInrDisplayAsLakh(mmv.ackoPriceDisplay)}
            </span>
            {!car.unavailable ? (
              <>
                <span className="mmv__price-dealer">
                  {formatInrDisplayAsLakh(mmv.dealerPriceDisplay)}
                </span>
                <span className="mmv__price-save">{mmv.saveAmountDisplay}</span>
              </>
            ) : null}
          </div>

          <div className="mmv__price-divider" />

          <div className="mmv__delivery">
            <span className="mmv__delivery-main">
              <BoltIcon />
              <span className="mmv__delivery-copy">
                <span className="mmv__delivery-em">Express delivery</span>
                <span className="mmv__delivery-by"> by </span>
                <span className="mmv__delivery-date">{mmv.expressDeliveryLabel}</span>
              </span>
            </span>
            <span className="mmv__delivery-chevron" aria-hidden>
              <ChevronDownTiny />
            </span>
          </div>

          <button type="button" className="mmv__cta">
            Generate quote
          </button>
        </section>

        {/* Figma: Shivi AD integration — node 297:40065 (MMV Shivi card) */}
        <section className="mmv__shivi" aria-labelledby="mmv-shivi-title">
          <div className="mmv__shivi-top">
            <div className="mmv__shivi-avatar-slot" aria-hidden>
              <div className="mmv__shivi-photo">
                <AssetIcon
                  src={ASSETS.shiviAvatar}
                  alt=""
                  width={56}
                  height={56}
                  className="mmv__shivi-img"
                />
              </div>
              <div className="mmv__shivi-online">
                <AssetIcon src={ASSETS.onlineIndicator} alt="" width={12} height={12} className="mmv__shivi-online-img" />
              </div>
            </div>
            <div className="mmv__shivi-copy">
              <p id="mmv-shivi-title" className="mmv__shivi-headline">
                {mmv.shiviHeadline}
              </p>
              <p className="mmv__shivi-sub">{mmv.shiviSubline}</p>
            </div>
          </div>
          <Link
            to={buildShiviIntroPath(car.id, displayColour.id)}
            className="mmv__shivi-cta"
          >
            {mmv.shiviCtaLabel}
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}

function ChevronDownTiny() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8.2L6.4 11.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Lightning bolt (Figma node 253:12898) */
function BoltIcon() {
  return (
    <svg
      className="mmv__delivery-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M8.58331 6.83337H12.6666L7.41665 14.4167V9.16671H3.33331L8.58331 1.58337V6.83337Z"
        fill="currentColor"
      />
    </svg>
  );
}
