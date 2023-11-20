import "../src/css/index.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import Login from "./components/Login";
import LoginDet from "./components/LoginDet";
import AppProvider from "./context/AppContext";
import ADash from "./views/Admin/Dashboard";
import BarC from "./components/charts/BarC";
import ADept from "./views/Admin/ADept";
import ASubj from "./views/Admin/ASubj";
import AFacult from "./views/Admin/AFacult";
import ALogin from "./components/ALogin";
import ACTheoryQ from "./views/Admin/ACTheoryQ";
import ACPractQ from "./views/Admin/ACPractQ";
import ReportA from "./components/ReportA";


function App() {
  return (

    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/details" element={<LoginDet />} />
          <Route path="/admin" element={<ADash />} />
          <Route path="/admin/login" element={<ALogin />} />
          <Route path="/admin/departments" element={<ADept />} />
          <Route path="/admin/subjects" element={<ASubj />} />
          <Route path="/admin/faculties" element={<AFacult />} />
          <Route path="/admin/theory-questions" element={<ACTheoryQ />} />
          <Route path="/admin/practical-questions" element={<ACPractQ />} />
          <Route path="/admin/report" element={<ReportA />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>

  );
}

export default App;
