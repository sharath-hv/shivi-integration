import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { navigateToShiviLandingWithCallbackScheduled } from "../lib/shiviLandingNavigation";
import { ASSETS } from "../lib/assets";
import "./shivi-callback-scheduled.css";

/** Figma: Shivi AD integration — node 253:11179 (callback scheduled) */

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
const DELAY_HEADER_S = 0;
const DELAY_CONTENT_S = 0.3;
const DELAY_CTA_S = 0.6;
const SUCCESS_ILLUSTRATION_PX = 104;

export type ShiviCallbackScheduledState = {
  dateLabel: string;
  slotLabel: string;
};

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
      className="shivi-callback-scheduled__chip-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 4.75V8l2.25 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

function defaultScheduledSummary(): { dateLabel: string; slotLabel: string } {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    dateLabel: DATE_FORMATTER.format(tomorrow),
    slotLabel: "10:00 AM \u2013 12:00 PM",
  };
}

export function ShiviCallbackScheduledPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const { dateLabel, slotLabel } = useMemo(() => {
    const s = location.state as ShiviCallbackScheduledState | null;
    if (s?.dateLabel && s?.slotLabel) {
      return { dateLabel: s.dateLabel, slotLabel: s.slotLabel };
    }
    return defaultScheduledSummary();
  }, [location.state]);

  const chipText = `${dateLabel} · ${slotLabel}`;

  const goToShiviWithScheduledNotice = () =>
    navigateToShiviLandingWithCallbackScheduled(navigate, {
      replace: true,
      search: location.search,
    });

  const t = (delayS: number) => ({
    duration: reduceMotion ? 0 : REVEAL_S,
    delay: reduceMotion ? 0 : delayS,
    ease: REVEAL_EASE,
  });

  const fromBottom = { opacity: 0, y: reduceMotion ? 0 : 8 };
  const toVisible = { opacity: 1, y: 0 };

  return (
    <MobileShell className="mobile-shell--shivi-intro">
      <div className="shivi-callback-scheduled">
        <motion.header
          className="shivi-callback-scheduled__top"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_HEADER_S)}
        >
          <button
            type="button"
            className="shivi-callback-scheduled__back"
            onClick={goToShiviWithScheduledNotice}
            aria-label="Back to Shivi"
          >
            <BackIcon />
          </button>
        </motion.header>

        <motion.main
          className="shivi-callback-scheduled__main"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CONTENT_S)}
        >
          <AssetIcon
            src={ASSETS.success}
            alt=""
            width={SUCCESS_ILLUSTRATION_PX}
            height={SUCCESS_ILLUSTRATION_PX}
            className="shivi-callback-scheduled__illustration"
          />
          <div className="shivi-callback-scheduled__copy">
            <h1 className="shivi-callback-scheduled__title">Callback scheduled!</h1>
            <div className="shivi-callback-scheduled__chip">
              <ClockIcon />
              <p className="shivi-callback-scheduled__chip-text">{chipText}</p>
            </div>
          </div>
        </motion.main>

        <motion.footer
          className="shivi-callback-scheduled__footer"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CTA_S)}
        >
          <div className="shivi-callback-scheduled__cta-panel">
            <button
              type="button"
              className="shivi-callback-scheduled__cta"
              onClick={goToShiviWithScheduledNotice}
            >
              Got it
            </button>
          </div>
        </motion.footer>
      </div>
    </MobileShell>
  );
}
