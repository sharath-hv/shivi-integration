import { matchPath, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FlowSwitcher } from "./components/FlowSwitcher";
import { CarListingPage } from "./pages/CarListingPage";
import { MmvPage } from "./pages/MmvPage";
import { ShiviCallConfirmationPage } from "./pages/ShiviCallConfirmationPage";
import { ShiviDiscountUnlockedPage } from "./pages/ShiviDiscountUnlockedPage";
import { ShiviIntroPage } from "./pages/ShiviIntroPage";
import { ShiviCallbackScheduledPage } from "./pages/ShiviCallbackScheduledPage";
import { ShiviScheduleCallbackPage } from "./pages/ShiviScheduleCallbackPage";

export default function App() {
  const location = useLocation();
  const showFlowSwitcher =
    matchPath({ path: "/cars", end: true }, location.pathname) != null ||
    matchPath({ path: "/cars/:carId", end: true }, location.pathname) != null;

  return (
    <>
      {showFlowSwitcher ? <FlowSwitcher /> : null}
      <Routes>
      <Route path="/" element={<Navigate to="/cars" replace />} />
      <Route path="/cars" element={<CarListingPage />} />
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
