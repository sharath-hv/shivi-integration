import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { ASSETS } from "../lib/assets";
import { SHIVI_INTRO_CAR_QUERY } from "../lib/shiviIntroContext";
import { navigateToShiviLandingWithCallbackScheduled } from "../lib/shiviLandingNavigation";
import "./shivi-confirmation.css";

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
const DELAY_HEADER_S = 0;
const DELAY_CONTENT_S = 0.3;
const DELAY_CTA_S = 0.6;
/** Intrinsic img size — matches `.shivi-confirm__illustration` / Success.svg */
const SUCCESS_ILLUSTRATION_PX = 98;

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

export function ShiviCallConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();

  /** MMV flow sets ?car=<id> on the Shivi route; only then we unlock a price. */
  const isMmvFlow = Boolean(searchParams.get(SHIVI_INTRO_CAR_QUERY));

  const goToShiviWithScheduledNotice = () =>
    navigateToShiviLandingWithCallbackScheduled(navigate, {
      replace: true,
      search: location.search,
    });

  const handlePrimaryCta = () => {
    if (isMmvFlow) {
      navigate({ pathname: "/shivi/unlocked", search: location.search });
      return;
    }
    goToShiviWithScheduledNotice();
  };

  const t = (delayS: number) => ({
    duration: reduceMotion ? 0 : REVEAL_S,
    delay: reduceMotion ? 0 : delayS,
    ease: REVEAL_EASE,
  });

  const fromBottom = { opacity: 0, y: reduceMotion ? 0 : 8 };
  const toVisible = { opacity: 1, y: 0 };

  return (
    <MobileShell className="mobile-shell--shivi-intro">
      <div className="shivi-confirm">
        <motion.header
          className="shivi-confirm__top"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_HEADER_S)}
        >
          <button
            type="button"
            className="shivi-confirm__back"
            onClick={goToShiviWithScheduledNotice}
            aria-label="Back to Shivi"
          >
            <BackIcon />
          </button>
        </motion.header>

        <motion.main
          className="shivi-confirm__main"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CONTENT_S)}
        >
          <AssetIcon
            src={ASSETS.success}
            alt=""
            width={SUCCESS_ILLUSTRATION_PX}
            height={SUCCESS_ILLUSTRATION_PX}
            className="shivi-confirm__illustration"
          />
          <h1 className="shivi-confirm__title">Shivi will call you shortly</h1>
        </motion.main>

        <motion.footer
          className="shivi-confirm__footer"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CTA_S)}
        >
          <div className="shivi-confirm__cta-panel">
            <button
              type="button"
              className="shivi-confirm__cta"
              onClick={handlePrimaryCta}
            >
              Got it
            </button>
          </div>
        </motion.footer>
      </div>
    </MobileShell>
  );
}
