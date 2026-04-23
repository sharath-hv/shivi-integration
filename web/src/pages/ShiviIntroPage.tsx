import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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

const TILES_DEFAULT: { title: string; iconSrc: string }[] = [
  { title: "Get a dealer-beating price", iconSrc: ASSETS.shiviTileCarPrice },
  { title: "Compare cars that you like", iconSrc: ASSETS.shiviTileCompareCars },
  { title: "Sort out car finance", iconSrc: ASSETS.shiviTileCarFinance },
  { title: "Answer any questions you have", iconSrc: ASSETS.shiviTileAnswerQuestions },
];

/** Shivi_car context — Figma node 253:11434 (context-aware help tiles). */
const TILES_CAR_CONTEXT: { title: string; iconSrc: string }[] = [
  { title: "Compare variants", iconSrc: ASSETS.shiviTileCompareCars },
  { title: "Loan options", iconSrc: ASSETS.shiviTileCarFinance },
  { title: "Clear your questions", iconSrc: ASSETS.shiviTileAnswerQuestions },
];

/** Remove car name prefix from the variant title when it starts with it. */
function variantShortLabel(carName: string, variantTitle: string): string {
  if (variantTitle.toLowerCase().startsWith(carName.toLowerCase())) {
    const rest = variantTitle.slice(carName.length).trim();
    return rest || variantTitle;
  }
  return variantTitle;
}

/** `Save ₹27,077` → `-₹27,077`. Falls back to the original string. */
function toDiscountLabel(saveAmountDisplay: string): string {
  const match = saveAmountDisplay.match(/Save\s+(.+)/i);
  if (match && match[1]) {
    return `-${match[1]}`;
  }
  return saveAmountDisplay;
}

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
/** Subtle staggered loading: 1) header + avatar, 2) car context (MMV), 3) "Here's how" + cards, 4) trust + CTAs */
const DELAY_CONTEXT_S = 0.3;
const DELAY_HELP_S = 0.6;
const DELAY_CTA_S = 0.9;

const DEFAULT_TAGLINE = "I’m Shivi, your car buying advisor";

export type ShiviIntroLocationState = {
  showCallbackScheduled?: boolean;
};

export function ShiviIntroPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [showCallbackNotice] = useState(() =>
    Boolean((location.state as ShiviIntroLocationState | null)?.showCallbackScheduled),
  );

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

  useEffect(() => {
    const s = location.state as ShiviIntroLocationState | null;
    if (s?.showCallbackScheduled) {
      navigate(
        { pathname: location.pathname, search: location.search },
        { replace: true, state: {} },
      );
    }
  }, [location.pathname, location.search, location.state, navigate]);

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

  const shiviFlowSearch = location.search;

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
              aria-label="Back to showroom"
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
              <p className="shivi-intro__hi">Hi there</p>
              <p className="shivi-intro__tagline">{DEFAULT_TAGLINE}</p>
              {contextCar ? (
                <p className="shivi-intro__context-sub">
                  I can help you get a better deal on this car.
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>

        {contextCar && contextColour ? (
          <motion.section
            className="shivi-intro__price-card"
            aria-label={`${contextCar.name} price summary`}
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
              <div className="shivi-intro__price-card-row shivi-intro__price-card-row--dealer">
                <span className="shivi-intro__price-card-row-label">Dealer price</span>
                <span className="shivi-intro__price-card-row-value">
                  {contextCar.mmv.dealerPriceDisplay}
                </span>
              </div>
              <div className="shivi-intro__price-card-row shivi-intro__price-card-row--discount">
                <span className="shivi-intro__price-card-row-label">ACKO Discount</span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--discount">
                  {toDiscountLabel(contextCar.mmv.saveAmountDisplay)}
                </span>
              </div>
              <div className="shivi-intro__price-card-divider" aria-hidden />
              <div className="shivi-intro__price-card-row shivi-intro__price-card-row--total">
                <span className="shivi-intro__price-card-row-label shivi-intro__price-card-row-label--total">
                  ACKO Drive price
                </span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--total">
                  {contextCar.mmv.ackoPriceDisplay}
                </span>
              </div>
            </div>
            <p className="shivi-intro__price-card-footnote">
              <PhoneIcon />
              <span>Talk to Shivi to unlock exclusive price.</span>
            </p>
          </motion.section>
        ) : null}

        <motion.div
          className={
            "shivi-intro__help-block" +
            (contextCar && contextColour ? " shivi-intro__help-block--context" : "")
          }
          initial={fromBottom}
          animate={toVisible}
          transition={t(contextCar ? DELAY_HELP_S + 0.06 : DELAY_HELP_S)}
        >
          <p className="shivi-intro__section-label">
            {contextCar && contextColour
              ? "A few more things I can help with"
              : "Here’s how I can help you"}
          </p>
          <div
            className={
              "shivi-intro__grid" +
              (contextCar && contextColour ? " shivi-intro__grid--context" : "")
            }
          >
            {(contextCar && contextColour ? TILES_CAR_CONTEXT : TILES_DEFAULT).map((tile) => (
              <div key={tile.title} className="shivi-intro__tile">
                <AssetIcon
                  src={tile.iconSrc}
                  alt=""
                  width={contextCar && contextColour ? 20 : 24}
                  height={contextCar && contextColour ? 20 : 24}
                  className="shivi-intro__tile-icon shivi-intro__tile-icon--asset"
                />
                <p className="shivi-intro__tile-text">{tile.title}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {showCallbackNotice ? (
          <motion.footer
            className="shivi-intro__footer shivi-intro__footer--callback-scheduled"
            initial={fromBottom}
            animate={toVisible}
            transition={t(DELAY_CTA_S)}
          >
            <div className="shivi-intro__callback-notice" role="status">
              <p>Callback scheduled</p>
            </div>
          </motion.footer>
        ) : (
          <motion.footer
            className="shivi-intro__footer"
            initial={fromBottom}
            animate={toVisible}
            transition={t(DELAY_CTA_S)}
          >
            {contextCar && contextColour ? null : (
              <div className="shivi-intro__trust-banner" role="note">
                <p>No spam. Just a quick call to help you decide.</p>
              </div>
            )}
            <div className="shivi-intro__cta-panel">
              <button
                type="button"
                className="shivi-intro__cta shivi-intro__cta--primary"
                onClick={() =>
                  navigate({ pathname: "/shivi/confirmation", search: shiviFlowSearch })
                }
              >
                Get a call right now
              </button>
              <button
                type="button"
                className="shivi-intro__cta-link"
                onClick={() =>
                  navigate({ pathname: "/shivi/schedule-callback", search: shiviFlowSearch })
                }
              >
                Schedule a callback
              </button>
            </div>
          </motion.footer>
        )}
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

function PhoneIcon() {
  return (
    <svg
      className="shivi-intro__price-card-footnote-icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M17.5 14.4v2.1a1.4 1.4 0 0 1-1.53 1.4 13.86 13.86 0 0 1-6.04-2.15 13.65 13.65 0 0 1-4.2-4.2A13.86 13.86 0 0 1 3.58 5.5 1.4 1.4 0 0 1 4.97 4h2.1a1.4 1.4 0 0 1 1.4 1.2c.09.65.24 1.28.47 1.88a1.4 1.4 0 0 1-.32 1.47L7.72 9.46a11.2 11.2 0 0 0 4.2 4.2l.92-.91a1.4 1.4 0 0 1 1.47-.32c.6.22 1.24.38 1.89.47a1.4 1.4 0 0 1 1.2 1.42Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
