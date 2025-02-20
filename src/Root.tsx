import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import { ResetPassword } from "./components/ResetPassword";
import { RefreshPassword } from "./components/RefreshPassword";

const RootLayout = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat/:chatId" element={<App />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/refresh-password" element={<RefreshPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default RootLayout;
