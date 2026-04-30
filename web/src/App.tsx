import { useEffect } from "react";
import { matchPath, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FlowSwitcher } from "./components/FlowSwitcher";
import { MM_OVERVIEW_PATH } from "./lib/flow-routes";
import { CarListingPage } from "./pages/CarListingPage";
import { MmOverviewPage } from "./pages/MmOverviewPage";
import { MmvPage } from "./pages/MmvPage";
import { ShiviCallConfirmationPage } from "./pages/ShiviCallConfirmationPage";
import { ShiviDiscountUnlockedPage } from "./pages/ShiviDiscountUnlockedPage";
import { ShiviIntroPage } from "./pages/ShiviIntroPage";
import { ShiviCallbackScheduledPage } from "./pages/ShiviCallbackScheduledPage";
import { ShiviScheduleCallbackPage } from "./pages/ShiviScheduleCallbackPage";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  const showFlowSwitcher =
    matchPath({ path: "/cars", end: true }, location.pathname) != null ||
    matchPath({ path: "/cars/:carId", end: true }, location.pathname) != null ||
    matchPath({ path: MM_OVERVIEW_PATH, end: true }, location.pathname) != null;

  return (
    <>
      {showFlowSwitcher ? <FlowSwitcher /> : null}
      <Routes>
      <Route path="/" element={<Navigate to="/cars" replace />} />
      <Route path="/cars" element={<CarListingPage />} />
      <Route path={MM_OVERVIEW_PATH} element={<MmOverviewPage />} />
      <Route path="/cars/:carId" element={<MmvPage />} />
      <Route path="/shivi" element={<ShiviIntroPage />} />
      <Route path="/shivi/schedule-callback" element={<ShiviScheduleCallbackPage />} />
      <Route path="/shivi/callback-scheduled" element={<ShiviCallbackScheduledPage />} />
      <Route path="/shivi/confirmation" element={<ShiviCallConfirmationPage />} />
      <Route path="/shivi/unlocked" element={<ShiviDiscountUnlockedPage />} />
    </Routes>
    </>
  );
}
