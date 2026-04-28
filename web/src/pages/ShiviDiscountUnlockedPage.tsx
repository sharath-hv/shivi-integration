import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { getCarById } from "../data/cars";
import { ASSETS } from "../lib/assets";
import {
  formatExclusiveUnlockedPrice,
  SHIVI_UNLOCK_EXCLUSIVE_DISCOUNT_INR,
} from "../lib/mmvPriceFormat";
import {
  SHIVI_INTRO_CAR_QUERY,
  SHIVI_INTRO_COLOUR_QUERY,
} from "../lib/shiviIntroContext";
import "./shivi-intro.css";
import "./shivi-unlocked.css";

/** Figma: Shivi AD integration — node 312:68392 (post-conversation, MMV flow). */
const TILES_CAR_CONTEXT: { lines: string[]; iconSrc: string }[] = [
  { lines: ["Compare variants", "easily"], iconSrc: ASSETS.shiviTileCompareCars },
  { lines: ["Understand", "finance options"], iconSrc: ASSETS.shiviTileCarFinance },
  { lines: ["Clear your", "questions"], iconSrc: ASSETS.shiviTileAnswerQuestions },
];

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
const DELAY_SUMMARY_S = 0.15;
const DELAY_CONTEXT_S = 0.3;
const DELAY_HELP_S = 0.6;
const DELAY_CTA_S = 0.9;

const DEFAULT_TAGLINE = "I’m Shivi, your car buying advisor";

const SHIVI_DISCOUNT_INR_DISPLAY = `₹${SHIVI_UNLOCK_EXCLUSIVE_DISCOUNT_INR.toLocaleString("en-IN")}`;

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

/** Target 3 lines with buffer for font rendering tolerances. */
const SUMMARY_MAX_LINES = 3;

function applyCallSummaryMeasureStyles(
  measure: HTMLElement,
  widthPx: number,
  styleSource: HTMLElement,
) {
  const cs = getComputedStyle(styleSource);
  measure.style.cssText = [
    "position:absolute",
    "left:-99999px",
    "top:0",
    `width:${widthPx}px`,
    "visibility:hidden",
    "pointer-events:none",
    "box-sizing:border-box",
    "white-space:normal",
    "margin:0",
    "padding:0",
    "border:none",
    `font-family:${cs.fontFamily}`,
    `font-size:${cs.fontSize}`,
    `font-weight:${cs.fontWeight}`,
    `line-height:${cs.lineHeight}`,
    `letter-spacing:${cs.letterSpacing}`,
    `word-break:${cs.wordBreak}`,
    `overflow-wrap:${cs.overflowWrap}`,
    `color:${cs.color}`,
  ].join(";");
}

function fillCallSummaryMeasure(
  measure: HTMLElement,
  slice: string,
  withEllipsis: boolean,
  withButton: boolean,
) {
  measure.replaceChildren();
  const span = document.createElement("span");
  span.textContent = withEllipsis ? `${slice}…\u00A0` : slice;
  measure.appendChild(span);
  if (withButton) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "See more";
    // Match exact CSS from .shivi-unlocked__call-summary-more
    btn.style.cssText = [
      "display:inline",
      "padding:0", 
      "border:none",
      "margin:0",
      "background:none",
      "font-family:inherit",
      "font-size:12px",
      "font-weight:500",
      "line-height:18px",
      "color:#1b73e8",
      "vertical-align:baseline",
      "white-space:nowrap"
    ].join(";");
    measure.appendChild(btn);
  }
}

/** Max prefix length so `prefix… See more` fits in SUMMARY_MAX_LINES at widthPx (matches live layout). */
function computeCallSummaryTruncation(
  fullText: string,
  widthPx: number,
  styleSource: HTMLElement,
): { truncated: boolean; end: number } {
  if (widthPx < 8 || !fullText) {
    return { truncated: false, end: fullText.length };
  }

  const measure = document.createElement("div");
  applyCallSummaryMeasureStyles(measure, widthPx, styleSource);
  document.body.appendChild(measure);

  try {
    // Calculate target height from actual computed line-height
    const cs = getComputedStyle(styleSource);
    const lineHeightPx = parseFloat(cs.lineHeight) || 18;
    const maxHeight = lineHeightPx * SUMMARY_MAX_LINES;
    // More generous tolerance for font rendering variations
    const tolerance = Math.max(4, lineHeightPx * 0.25);

    // Check if full text fits without truncation
    fillCallSummaryMeasure(measure, fullText, false, false);
    if (measure.scrollHeight <= maxHeight + tolerance) {
      return { truncated: false, end: fullText.length };
    }

    // Binary search for optimal truncation point
    let lo = 0;
    let hi = fullText.length;
    let best = 0;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const slice = fullText.slice(0, mid).trimEnd();
      fillCallSummaryMeasure(measure, slice, true, true);
      if (measure.scrollHeight <= maxHeight + tolerance) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    const safeEnd =
      best < 1 && fullText.length > 0 ? Math.min(1, fullText.length) : best;
    return { truncated: true, end: safeEnd };
  } finally {
    document.body.removeChild(measure);
  }
}

function formatCallSummaryTitleLine(): string {
  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `Call summary · Today, ${time}`;
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

  /** Match `/shivi/unlocked?car=&colour=` with a valid colour id (not car-only fallback). */
  const hasCarColourDeepLink = useMemo(() => {
    if (!contextCar || !contextColourIdParam) {
      return false;
    }
    return contextCar.mmv.colours.some((c) => c.id === contextColourIdParam);
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

  const [callSummaryExpanded, setCallSummaryExpanded] = useState(false);

  useEffect(() => {
    setCallSummaryExpanded(false);
  }, [contextCarId, contextColourIdParam]);

  const callSummaryTitle = useMemo(() => formatCallSummaryTitleLine(), []);

  const callSummaryBody = useMemo(() => {
    if (!contextCar || !contextColour) {
      return "";
    }
    const variant = variantShortLabel(contextCar.name, contextCar.mmv.variantTitle);
    return `You're looking at the ${contextCar.name} ${variant} in ${contextColour.name} as your primary option. You mentioned this would be a family car — mainly city driving with occasional highway trips. A loan works better for you, with a budget around ₹15L. You're fairly decided and looking to close within the next 30 days. Based on all of this, I've negotiated the best price I could get you on this exact variant.`;
  }, [contextCar, contextColour]);

  const callSummaryBodyRef = useRef<HTMLDivElement>(null);
  const [summaryTruncation, setSummaryTruncation] = useState<{
    truncated: boolean;
    end: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (callSummaryExpanded || !callSummaryBody) {
      setSummaryTruncation(null);
      return;
    }

    const el = callSummaryBodyRef.current;
    if (!el) {
      return;
    }

    let rafId = 0;
    const runMeasure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = el.clientWidth;
        if (w < 8) {
          return;
        }
        setSummaryTruncation(computeCallSummaryTruncation(callSummaryBody, w, el));
      });
    };

    runMeasure();
    const ro = new ResizeObserver(runMeasure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [callSummaryBody, callSummaryExpanded]);

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
              <p className="shivi-intro__hi">
                {hasCarColourDeepLink
                  ? "Your deal is ready, Sharath"
                  : "Hi Sharath"}
              </p>
              <p className="shivi-intro__tagline">
                {hasCarColourDeepLink
                  ? `I’ve unlocked a ${SHIVI_DISCOUNT_INR_DISPLAY} discount just for you.`
                  : DEFAULT_TAGLINE}
              </p>
              {hasCarColourDeepLink ? null : (
                <p className="shivi-intro__context-sub">
                  {`I've unlocked your price on the ${shortModelName}.`}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {contextCar && contextColour ? (
          <>
            <motion.section
              className="shivi-unlocked__call-summary"
              aria-label="Call summary"
              initial={fromBottom}
              animate={toVisible}
              transition={t(DELAY_SUMMARY_S)}
            >
              <div className="shivi-unlocked__call-summary-header">
                <span
                  className="shivi-unlocked__call-summary-icon"
                  aria-hidden
                >
                  <AssetIcon
                    src={ASSETS.callSummary}
                    alt=""
                    width={16}
                    height={16}
                    className="shivi-unlocked__call-summary-icon-img"
                  />
                </span>
                <p className="shivi-unlocked__call-summary-title">
                  {callSummaryTitle}
                </p>
              </div>
              <div
                ref={callSummaryBodyRef}
                className="shivi-unlocked__call-summary-body"
              >
                {callSummaryExpanded ? (
                  <p className="shivi-unlocked__call-summary-expanded">
                    {callSummaryBody}{" "}
                    <button
                      type="button"
                      className="shivi-unlocked__call-summary-more shivi-unlocked__call-summary-more--inline"
                      onClick={() => setCallSummaryExpanded(false)}
                      aria-expanded
                    >
                      See less
                    </button>
                  </p>
                ) : summaryTruncation === null ? (
                  <p className="shivi-unlocked__call-summary-clamped">
                    {callSummaryBody}
                  </p>
                ) : summaryTruncation.truncated ? (
                  <p className="shivi-unlocked__call-summary-collapsed">
                    <span>
                      {`${callSummaryBody.slice(0, summaryTruncation.end).trimEnd()}…\u00A0`}
                    </span>
                    <button
                      type="button"
                      className="shivi-unlocked__call-summary-more shivi-unlocked__call-summary-more--inline"
                      onClick={() => setCallSummaryExpanded(true)}
                      aria-expanded={false}
                    >
                      See more
                    </button>
                  </p>
                ) : (
                  <p className="shivi-unlocked__call-summary-expanded">
                    {callSummaryBody}
                  </p>
                )}
              </div>
            </motion.section>

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
              <div className="shivi-intro__price-card-divider" aria-hidden />
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label shivi-intro__price-card-row-label--total">
                  Shivi discount
                </span>
                <span className="shivi-intro__price-card-row-value shivi-intro__price-card-row-value--shivi">
                  {`-${SHIVI_UNLOCK_EXCLUSIVE_DISCOUNT_INR.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="shivi-intro__price-card-row">
                <span className="shivi-intro__price-card-row-label shivi-intro__price-card-row-label--total">
                  Exclusive price
                </span>
                <span className="shivi-intro__price-card-row-value shivi-unlocked__price-card-row-value--exclusive">
                  {formatExclusiveUnlockedPrice(contextCar.mmv.ackoPriceDisplay)}
                </span>
              </div>
            </div>
          </motion.section>
          </>
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
              <div key={tile.lines.join(" ")} className="shivi-intro__tile">
                <div className="shivi-intro__tile-icon-wrap">
                  <AssetIcon
                    src={tile.iconSrc}
                    alt=""
                    width={20}
                    height={20}
                    className="shivi-intro__tile-icon shivi-intro__tile-icon--asset"
                  />
                </div>
                <p className="shivi-intro__tile-text">
                  {tile.lines.map((line, i) => (
                    <span key={i} className="shivi-intro__tile-text-line">
                      {line}
                    </span>
                  ))}
                </p>
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
            <p>
              {hasCarColourDeepLink
                ? `Your ${SHIVI_DISCOUNT_INR_DISPLAY} discount expires in 24 hours`
                : "Your exclusive price expires in 24 hours"}
            </p>
          </div>
          <div className="shivi-intro__cta-panel">
            <button
              type="button"
              className="shivi-intro__cta shivi-intro__cta--primary"
              onClick={goBook}
            >
              Lock this price
            </button>
            <button
              type="button"
              className="shivi-unlocked__callback-link"
              onClick={goCallback}
            >
              <span className="shivi-unlocked__callback-prefix">Have questions?</span>
              <span className="shivi-unlocked__callback-action">Get a callback</span>
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
