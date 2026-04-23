import { AssetIcon } from "../components/AssetIcon";
import { MobileShell } from "../components/MobileShell";
import { ShiviListingStrip } from "../components/ShiviListingStrip";
import { CarCard } from "../components/CarCard";
import { ASSETS } from "../lib/assets";
import { showroomCars } from "../data/cars";
import "./car-listing.css";

const FILTER_CHIPS: Array<
  | { kind: "filter" }
  | { kind: "sort" }
  | { kind: "express" }
  | { kind: "chevron"; id: string; label: string }
> = [
  { kind: "filter" },
  { kind: "sort" },
  { kind: "express" },
  { kind: "chevron", id: "transmission", label: "Transmission type" },
  { kind: "chevron", id: "brand", label: "Brand" },
  { kind: "chevron", id: "body", label: "Body type" },
  { kind: "chevron", id: "fuel", label: "Fuel type" },
];

export function CarListingPage() {
  return (
    <MobileShell className="mobile-shell--drive-listing">
      <div className="car-listing-page">
        <header className="listing-topbar">
          <div className="listing-topbar__city">
            <AssetIcon src={ASSETS.location} width={20} height={20} className="listing-icon" />
            <span>Bengaluru</span>
          </div>
        </header>

        <h1 className="listing-page-title">Your showroom</h1>

        <div className="listing-search listing-search--drive">
          <AssetIcon src={ASSETS.search} width={24} height={24} className="listing-icon" />
          <label htmlFor="showroom-search" className="visually-hidden">
            Search cars
          </label>
          <input
            id="showroom-search"
            type="search"
            placeholder="Search by model or brand"
            autoComplete="off"
          />
        </div>

        <div className="listing-chips listing-chips--drive" role="toolbar" aria-label="Filters">
          {FILTER_CHIPS.map((chip) => {
            if (chip.kind === "filter") {
              return (
                <button key="filter" type="button" className="listing-chip-drive listing-chip-drive--filter">
                  <AssetIcon src={ASSETS.filter} width={16} height={16} className="listing-icon" />
                  <span>Filter</span>
                </button>
              );
            }
            if (chip.kind === "sort") {
              return (
                <button key="sort" type="button" className="listing-chip-drive listing-chip-drive--sort">
                  <span className="listing-chip-drive__sort-label">Sort:</span>
                  <span className="listing-chip-drive__sort-value">Price</span>
                  <ChevronDownIcon />
                </button>
              );
            }
            if (chip.kind === "express") {
              return (
                <button key="express" type="button" className="listing-chip-drive listing-chip-drive--express">
                  <AssetIcon src={ASSETS.expressDelivery} width={16} height={16} className="listing-icon" />
                  <span>Express delivery</span>
                </button>
              );
            }
            return (
              <button key={chip.id} type="button" className="listing-chip-drive listing-chip-drive--chevron">
                <span>{chip.label}</span>
                <ChevronDownIcon />
              </button>
            );
          })}
        </div>

        <section className="listing-cards listing-cards--drive" aria-label="Car listings">
          {showroomCars
            .filter((c) => c.id !== "toyota-hyryder")
            .map((car, index) => (
              <CarCard key={car.id} car={car} index={index} variant="drive" />
            ))}
        </section>

        <ShiviListingStrip variant="drive" />
      </div>
    </MobileShell>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
