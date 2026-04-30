import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { ASSETS } from "../lib/assets";
import { MM_OVERVIEW_PATH } from "../lib/flow-routes";
import "./mm-overview.css";
import "./mmv.css";

/** Figma: Shivi AD integration — node 412:2971 (MM overview) */
const SLIDE_COUNT = 4;

/** Static hero copy aligned with design. */
const MM_OVERVIEW = {
  title: "Tata Punch",
  priceLabel: "ACKO Drive price starts from",
  ackoPrice: "₹13.08 lakh",
  dealerPrice: "₹13.7 lakh",
  save: "Save ₹62,077",
  expressBy: "14 Feb '25",
} as const;

export function MmOverviewPage() {
  const scrollerId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const slide = track.querySelector<HTMLElement>(".mm-overview__slide");
    const slideWidth = slide?.offsetWidth ?? 1;
    const gap = 12;
    const stride = slideWidth + gap;
    const idx = Math.round(track.scrollLeft / stride);
    setActiveIndex(Math.min(SLIDE_COUNT - 1, Math.max(0, idx)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    syncActiveFromScroll();
    track.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    return () => track.removeEventListener("scroll", syncActiveFromScroll);
  }, [syncActiveFromScroll]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const slide = track.querySelector<HTMLElement>(".mm-overview__slide");
    const slideWidth = slide?.offsetWidth ?? 0;
    const gap = 12;
    track.scrollTo({ left: index * (slideWidth + gap), behavior: "smooth" });
  };

  return (
    <MobileShell className="mobile-shell--mm-overview">
      <div className="mm-overview">
        <header className="mm-overview__header">
          <h1 className="mm-overview__title">{MM_OVERVIEW.title}</h1>
        </header>

        <div className="mm-overview__carousel-wrap">
          <div
            id={scrollerId}
            ref={trackRef}
            className="mm-overview__carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label={`${MM_OVERVIEW.title} images`}
          >
            <div className="mm-overview__carousel-track">
              {Array.from({ length: SLIDE_COUNT }, (_, i) => (
                <div key={i} className="mm-overview__slide" aria-hidden={activeIndex !== i}>
                  <div className="mm-overview__card">
                    <div className="mm-overview__card-image-wrap">
                      <img
                        className="mm-overview__card-image"
                        src={ASSETS.mmvCar}
                        alt=""
                        width={312}
                        height={234}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mm-overview__dots" role="group" aria-label="Carousel position">
            {Array.from({ length: SLIDE_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={activeIndex === i ? "true" : undefined}
                aria-controls={scrollerId}
                className={"mm-overview__dot" + (activeIndex === i ? " mm-overview__dot--active" : "")}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </div>
        </div>

        <section className="mm-overview__price" aria-label="Pricing">
          <p className="mm-overview__price-intro">{MM_OVERVIEW.priceLabel}</p>

          <div className="mm-overview__price-row">
            <span className="mm-overview__price-acko">{MM_OVERVIEW.ackoPrice}</span>
            <span className="mm-overview__price-dealer-wrap">
              <span className="mm-overview__price-dealer">{MM_OVERVIEW.dealerPrice}</span>
            </span>
            <span className="mm-overview__price-save">{MM_OVERVIEW.save}</span>
          </div>

          <div className="mm-overview__express">
            <BoltIcon />
            <p className="mm-overview__express-copy">
              <span className="mm-overview__express-em">Express delivery</span>
              <span className="mm-overview__express-by"> by </span>
              <span className="mm-overview__express-date">{MM_OVERVIEW.expressBy}</span>
            </p>
          </div>

          <div className="mm-overview__divider" aria-hidden />

          <button type="button" className="mm-overview__cta-primary">
            Get a quote
          </button>
        </section>

        <section className="mmv__shivi" aria-labelledby="mm-overview-shivi-title">
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
                <AssetIcon
                  src={ASSETS.onlineIndicator}
                  alt=""
                  width={12}
                  height={12}
                  className="mmv__shivi-online-img"
                />
              </div>
            </div>
            <div className="mmv__shivi-copy">
              <p id="mm-overview-shivi-title" className="mmv__shivi-headline">
                Need help with this car?
              </p>
              <p className="mmv__shivi-sub">Better deal • Variant selection • Finance support</p>
            </div>
          </div>
          <Link to="/shivi" state={{ backPath: MM_OVERVIEW_PATH }} className="mmv__shivi-cta">
            Talk to Shivi
          </Link>
        </section>
      </div>
    </MobileShell>
  );
}

function BoltIcon() {
  return (
    <svg
      className="mm-overview__bolt"
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
