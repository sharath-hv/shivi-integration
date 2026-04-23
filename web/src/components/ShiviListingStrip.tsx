import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AssetIcon } from "./AssetIcon";
import { ASSETS } from "../lib/assets";
import "./shivi-listing-strip.css";

type ShiviListingStripProps = {
  variant?: "default" | "drive";
};

export function ShiviListingStrip({ variant = "default" }: ShiviListingStripProps) {
  const isDrive = variant === "drive";

  if (isDrive) {
    return (
      <motion.footer
        className="shivi-strip shivi-strip--drive"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="shivi-strip--drive__inner">
          <div className="shivi-strip--drive__avatar" aria-hidden>
            <div className="shivi-strip--drive__avatar-photo">
              <AssetIcon
                src={ASSETS.shiviAvatar}
                alt=""
                width={48}
                height={48}
                className="shivi-strip--drive__avatar-img"
              />
            </div>
            <AssetIcon
              src={ASSETS.onlineIndicator}
              alt=""
              width={10}
              height={10}
              className="shivi-strip--drive__avatar-online"
            />
          </div>
          <div className="shivi-strip--drive__copy">
            <p className="shivi-strip--drive__headline">Want to check if you can get a better price?</p>
            <Link to="/shivi" className="shivi-strip--drive__link">
              Talk to Shivi
              <ChevronRightIcon className="shivi-strip--drive__chevron" />
            </Link>
          </div>
        </div>
      </motion.footer>
    );
  }

  return (
    <motion.footer
      className="shivi-strip"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="shivi-strip__row">
        <div className="shivi-strip__avatar" aria-hidden>
          <div className="shivi-strip__avatar-photo">
            <AssetIcon
              src={ASSETS.shiviAvatar}
              alt=""
              width={48}
              height={48}
              className="shivi-strip__avatar-img"
            />
          </div>
          <AssetIcon
            src={ASSETS.onlineIndicator}
            alt=""
            width={10}
            height={10}
            className="shivi-strip__avatar-online"
          />
        </div>
        <div className="shivi-strip__copy">
          <p className="shivi-strip__headline">Need help to get a better deal?</p>
          <Link to="/shivi" className="shivi-strip__link">
            Talk to Shivi
            <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </motion.footer>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
