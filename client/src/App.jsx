import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider, AnchoredToastProvider } from "./components/ui/toast";
import Landing from "./pages/Landing";
import TicketPage from "./pages/Ticket-Page";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

function App() {
  return (
    <ToastProvider position="bottom-right" swipeDirection="right">
      <AnchoredToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/user/register" element={<Register />} />
            <Route path="/user/home" element={<Home />} />
            <Route path="/user/profile" element={<Profile />} />
            <Route path="/user/createTicket" element={<TicketPage />} />
            <Route path="/user/getTickets" element={<Dashboard />} />
            <Route path="/admin/panel" element={<AdminPanel />} />
          </Routes>
        </BrowserRouter>
      </AnchoredToastProvider>
    </ToastProvider>
  );
}

export default App;
