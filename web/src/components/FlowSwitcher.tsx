import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { FLOW_ROUTES } from "../lib/flow-routes";
import "./flow-switcher.css";

export function FlowSwitcher() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const location = useLocation();
  const panelCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.add("has-flow-switcher");
    return () => document.body.classList.remove("has-flow-switcher");
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const id = requestAnimationFrame(() => {
      panelCloseRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const toggle = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <button
        type="button"
        className={"flow-switcher__trigger" + (open ? " flow-switcher__trigger--hidden" : "")}
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        aria-label="Open flow menu"
        aria-hidden={open}
        tabIndex={open ? -1 : undefined}
      >
        <HamburgerIcon />
      </button>
      {open
        ? createPortal(
            <div className="flow-switcher__portal">
              <button
                type="button"
                className="flow-switcher__backdrop"
                aria-label="Close flow menu"
                onClick={close}
              />
              <nav
                className="flow-switcher__panel"
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label="Switch flow"
              >
                <div className="flow-switcher__panel-head">
                  <p className="flow-switcher__head-title">Flows</p>
                  <button
                    ref={panelCloseRef}
                    type="button"
                    className="flow-switcher__head-close"
                    onClick={close}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <ul className="flow-switcher__list">
                  {FLOW_ROUTES.map((flow) => (
                    <li key={flow.id}>
                      <NavLink
                        to={flow.path}
                        className={({ isActive }) =>
                          "flow-switcher__link" + (isActive ? " flow-switcher__link--active" : "")
                        }
                        end={flow.path === "/cars"}
                        onClick={close}
                      >
                        <span className="flow-switcher__link-label">{flow.label}</span>
                        <span className="flow-switcher__link-desc">{flow.description}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      className="flow-switcher__icon"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden
    >
      <path
        className="flow-switcher__bar flow-switcher__bar--1"
        d="M4 6h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="flow-switcher__bar flow-switcher__bar--2"
        d="M4 11h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="flow-switcher__bar flow-switcher__bar--3"
        d="M4 16h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
