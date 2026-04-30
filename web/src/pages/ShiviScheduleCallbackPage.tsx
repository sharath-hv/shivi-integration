import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { MobileShell } from "../components/MobileShell";
import { pickShiviBackPathState } from "../lib/shiviIntroContext";
import type { ShiviCallbackScheduledState } from "./ShiviCallbackScheduledPage";
import "./shivi-schedule-callback.css";

/** Figma: Shivi AD integration — node 253:11112 (Timeslot selection) */

type DayOption = {
  id: "today" | "tomorrow";
  label: string;
  dateLabel: string;
};

type SlotOption = {
  id: string;
  label: string;
};

const REVEAL_EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const REVEAL_S = 0.6;
const DELAY_HEADER_S = 0;
const DELAY_CONTENT_S = 0.3;
const DELAY_CTA_S = 0.6;

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

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

function buildDayOptions(now: Date): DayOption[] {
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [
    { id: "today", label: "Today", dateLabel: DATE_FORMATTER.format(today) },
    { id: "tomorrow", label: "Tomorrow", dateLabel: DATE_FORMATTER.format(tomorrow) },
  ];
}

const SLOTS: SlotOption[] = [
  { id: "10-12", label: "10:00 AM \u2013 12:00 PM" },
  { id: "12-14", label: "12:00 PM \u2013 2:00 PM" },
  { id: "14-16", label: "2:00 PM \u2013 4:00 PM" },
  { id: "16-18", label: "4:00 PM \u2013 6:00 PM" },
];

export function ShiviScheduleCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const days = useMemo(() => buildDayOptions(new Date()), []);
  const [selectedDay, setSelectedDay] = useState<DayOption["id"]>("today");
  const [selectedSlot, setSelectedSlot] = useState<SlotOption["id"]>(SLOTS[0]!.id);

  const goToScheduledConfirmation = () => {
    const day = days.find((d) => d.id === selectedDay);
    const slot = SLOTS.find((s) => s.id === selectedSlot);
    const persist = pickShiviBackPathState(location.state);
    const state: ShiviCallbackScheduledState = {
      dateLabel: day?.dateLabel ?? "",
      slotLabel: slot?.label ?? "",
      ...persist,
    };
    navigate({ pathname: "/shivi/callback-scheduled", search: location.search }, { state });
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
      <div className="shivi-schedule">
        <motion.header
          className="shivi-schedule__top"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_HEADER_S)}
        >
          <button
            type="button"
            className="shivi-schedule__back"
            onClick={() => {
              const persist = pickShiviBackPathState(location.state);
              navigate(
                { pathname: "/shivi", search: location.search },
                persist ? { state: persist } : undefined,
              );
            }}
            aria-label="Go back"
          >
            <BackIcon />
          </button>
        </motion.header>

        <motion.main
          className="shivi-schedule__main"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CONTENT_S)}
        >
          <h1 className="shivi-schedule__title">When should Shivi call you?</h1>

          <div
            className="shivi-schedule__days"
            role="radiogroup"
            aria-label="Pick a day"
          >
            {days.map((day) => {
              const isSelected = day.id === selectedDay;
              return (
                <button
                  key={day.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={
                    "shivi-schedule__day" +
                    (isSelected ? " shivi-schedule__day--selected" : "")
                  }
                  onClick={() => setSelectedDay(day.id)}
                >
                  <span className="shivi-schedule__day-label">{day.label}</span>
                  <span className="shivi-schedule__day-date">{day.dateLabel}</span>
                </button>
              );
            })}
          </div>

          <section className="shivi-schedule__slots-section" aria-label="Available time slots">
            <p className="shivi-schedule__slots-heading">Available time slots</p>
            <div
              className="shivi-schedule__slots"
              role="radiogroup"
              aria-label="Pick a time slot"
            >
              {SLOTS.map((slot) => {
                const isSelected = slot.id === selectedSlot;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={
                      "shivi-schedule__slot" +
                      (isSelected ? " shivi-schedule__slot--selected" : "")
                    }
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </section>
        </motion.main>

        <motion.footer
          className="shivi-schedule__footer"
          initial={fromBottom}
          animate={toVisible}
          transition={t(DELAY_CTA_S)}
        >
          <button
            type="button"
            className="shivi-schedule__cta"
            onClick={goToScheduledConfirmation}
          >
            Schedule my callback
          </button>
          <p className="shivi-schedule__sooner">
            <span className="shivi-schedule__sooner-text">Want a call sooner?</span>
            <button
              type="button"
              className="shivi-schedule__sooner-link"
            onClick={() => {
              const persist = pickShiviBackPathState(location.state);
              navigate(
                { pathname: "/shivi/confirmation", search: location.search },
                persist ? { state: persist } : undefined,
              );
            }}
            >
              Get a call right now
            </button>
          </p>
        </motion.footer>
      </div>
    </MobileShell>
  );
}
