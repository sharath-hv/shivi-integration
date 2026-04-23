import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { getCarById } from "../data/cars";
import { ASSETS } from "../lib/assets";
import {
  SHIVI_INTRO_CAR_QUERY,
  SHIVI_INTRO_COLOUR_QUERY,
} from "../lib/shiviIntroContext";
import "./shivi-intro.css";
import "./shivi-unlocked.css";

/** Figma: Shivi AD integration — node 312:68392 (post-conversation, MMV flow). */
const TILES_CAR_CONTEXT: { title: string; iconSrc: string }[] = [
  { title: "Compare variants", iconSrc: ASSETS.shiviTileCompareCars },
  { title: "Loan options", iconSrc: ASSETS.shiviTileCarFinance },
  { title: "Clear your questions", iconSrc: ASSETS.shiviTileAnswerQuestions },
];

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
const DELAY_CONTEXT_S = 0.3;
const DELAY_HELP_S = 0.6;
const DELAY_CTA_S = 0.9;

const DEFAULT_TAGLINE = "I’m Shivi, your car buying advisor";

/** `Save ₹27,077` → `-₹27,077`. Falls back to the original string. */
function toDiscountLabel(saveAmountDisplay: string): string {
  const match = saveAmountDisplay.match(/Save\s+(.+)/i);
  if (match && match[1]) {
    return `-${match[1]}`;
  }
  return saveAmountDisplay;
}

/** Remove car name prefix from the variant title when it starts with it. */
function variantShortLabel(carName: string, variantTitle: string): string {
  if (variantTitle.toLowerCase().startsWith(carName.toLowerCase())) {
    const rest = variantTitle.slice(carName.length).trim();
    return rest || variantTitle;
  }
  return variantTitle;
}

export function ShiviDiscountUnlockedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();

  const contextCarId = searchParams.get(SHIVI_INTRO_CAR_QUERY) ?? "";
  const contextColourIdParam = searchParams.get(SHIVI_INTRO_COLOUR_QUERY);

  const contextCar = useMemo(
    () => (contextCarId ? getCarById(contextCarId) : undefined),
    [contextCarId],
  );

  const contextColour = useMemo(() => {
    if (!contextCar) {
      return undefined;
    }
    const { colours, defaultColourId } = contextCar.mmv;
    const fromQuery = contextColourIdParam
      ? colours.find((c) => c.id === contextColourIdParam)
      : undefined;
    return (
      fromQuery ??
      colours.find((c) => c.id === defaultColourId) ??
      colours[0] ??
      undefined
    );
  }, [contextCar, contextColourIdParam]);

  const t = (delayS: number) => ({
    duration: reduceMotion ? 0 : REVEAL_S,
    delay: reduceMotion ? 0 : delayS,
    ease: REVEAL_EASE,
  });

  const fromBottom = { opacity: 0, y: reduceMotion ? 0 : 8 };
  const toVisible = { opacity: 1, y: 0 };

  const goBack = () => {
    if (contextCarId) {
      navigate(`/cars/${contextCarId}`);
      return;
    }
    navigate("/cars");
  };

  const goBook = () => {
    if (contextCarId) {
      navigate(`/cars/${contextCarId}`);
      return;
    }
    navigate("/cars");
  };

  const goCallback = () => {
    navigate({
      pathname: "/shivi/schedule-callback",
      search: searchParams.toString() ? `?${searchParams.toString()}` : "",
    });
  };

  const shortModelName = contextCar
    ? contextCar.name.replace(/^(kia|toyota|tata|mahindra|hyundai)\s+/i, "")
    : "car";

  return (
    <MobileShell className="mobile-shell--shivi-intro">
      <div className="shivi-intro">
        <motion.div
          className="shivi-intro__intro-block"
          initial={fromBottom}
          animate={toVisible}
          transition={t(0)}
        >
          <header className="shivi-intro__top">
            <button
              type="button"
              className="shivi-intro__back"
              onClick={goBack}
              aria-label="Back"
            >
              <BackIcon />
            </button>
          </header>

          <div className="shivi-intro__hero">
            <div className="shivi-intro__avatar" aria-hidden>
              <div className="shivi-intro__avatar-photo">
                <AssetIcon
                  src={ASSETS.shiviAvatar}
                  alt=""
                  width={56}
                  height={56}
                  className="shivi-intro__avatar-img"
                />
              </div>
              <AssetIcon
                src={ASSETS.onlineIndicator}
                alt=""
                width={12}
                height={12}
                className="shivi-intro__avatar-online"
              />
            </div>
            <div className="shivi-intro__greeting">
              <p className="shivi-intro__hi">Hi Sharath</p>
              <p className="shivi-intro__tagline">{DEFAULT_TAGLINE}</p>
              <p className="shivi-intro__context-sub">
                {`I've unlocked your price on the ${shortModelName}.`}
              </p>
            </div>
          </div>
        </motion.div>

        {contextCar && contextColour ? (
          <motion.section
            className="shivi-intro__price-card"
            aria-label={`${contextCar.name} exclusive price summary`}
            initial={fromBottom}
            animate={toVisible}
            transition={t(DELAY_CONTEXT_S)}
          >
            <div className="shivi-intro__price-card-top">
              <div className="shivi-intro__price-card-thumb-slot">
                <AssetIcon
                  src={contextCar.imageUrl}
                  alt=""
                  width={contextCar.imageWidth}
                  height={contextCar.imageHeight}
                  className="shivi-intro__price-card-thumb"
                />
              </div>
              <div className="shivi-intro__price-card-identity">
                <p className="shivi-intro__price-card-name">{contextCar.name}</p>
                <p className="shivi-intro__price-card-variant">
                  <span>
                    {variantShortLabel(contextCar.name, contextCar.mmv.variantTitle)}
                  </span>
                  <span className="shivi-intro__price-card-sep" aria-hidden>
                    {" · "}
                  </span>
                  <span>{contextColour.name}</span>
                </p>
              </div>
            </div>
            <div className="shivi-intro__price-card-box">
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label">Dealer price</span>
                <span className="shivi-intro__price-card-row-value">
                  {contextCar.mmv.dealerPriceDisplay}
                </span>
              </div>
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label">
                  ACKO Drive discount
                </span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--discount">
                  {toDiscountLabel(contextCar.mmv.saveAmountDisplay)}
                </span>
              </div>
              <div className="shivi-intro__price-card-divider" aria-hidden />
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label">ACKO Drive price</span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--subtotal">
                  {contextCar.mmv.ackoPriceDisplay}
                </span>
              </div>
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label shivi-intro__price-card-row-label--total">
                  Shivi discount
                </span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--shivi">
                  -20,000
                </span>
              </div>
              <div className="shivi-intro__price-card-divider" aria-hidden />
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label shivi-intro__price-card-row-label--total">
                  Exclusive price
                </span>
                <span className="shivi-intro__price-card-row-value shivi-unlocked__price-card-row-value--exclusive">
                  {contextCar.mmv.ackoPriceDisplay}
                </span>
              </div>
            </div>
          </motion.section>
        ) : null}

        <motion.div
          className="shivi-intro__help-block shivi-intro__help-block--context"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_HELP_S)}
        >
          <p className="shivi-intro__section-label">A few more things I can help with</p>
          <div className="shivi-intro__grid shivi-intro__grid--context">
            {TILES_CAR_CONTEXT.map((tile) => (
              <div key={tile.title} className="shivi-intro__tile">
                <AssetIcon
                  src={tile.iconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="shivi-intro__tile-icon shivi-intro__tile-icon--asset"
                />
                <p className="shivi-intro__tile-text">{tile.title}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.footer
          className="shivi-intro__footer"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CTA_S)}
        >
          <div className="shivi-unlocked__expiry" role="note">
            <ClockIcon />
            <p>Your exclusive price expires in 24 hours</p>
          </div>
          <div className="shivi-intro__cta-panel">
            <button
              type="button"
              className="shivi-intro__cta shivi-intro__cta--primary"
              onClick={goBook}
            >
              Book now
            </button>
            <button
              type="button"
              className="shivi-unlocked__callback-link"
              onClick={goCallback}
            >
              Get a callback
            </button>
          </div>
        </motion.footer>
      </div>
    </MobileShell>
  );
}

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="shivi-unlocked__expiry-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 4.5V8l2.2 1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
