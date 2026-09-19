import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import ProposalForm from "@/pages/ProposalForm";
import ProposalView from "@/pages/ProposalView";
import Tracker from "@/pages/Tracker";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Reservations from "@/pages/Reservations";

function App() {
  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proposals/new" element={<ProposalForm />} />
            <Route path="/proposals/:id/edit" element={<ProposalForm />} />
            <Route path="/proposals/:id" element={<ProposalView />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
