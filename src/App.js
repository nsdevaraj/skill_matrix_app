import React from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import TeamOverview from "./components/TeamOverview";
import SkillUpgradeGuide from "./components/SkillUpgradeGuide";
import Criteria from "./components/Criteria";
import SkillMatrix from "./components/SkillMatrix";
import EmployeeProfile from "./components/EmployeeProfile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Navigate to="/team-overview" />} />
            <Route path="/team-overview" element={<TeamOverview />} />
            <Route path="/skill-guide" element={<SkillUpgradeGuide />} />
            <Route path="/criteria" element={<Criteria />} />{" "}
            <Route path="/skill-matrix" element={<SkillMatrix />} />
            <Route path="/employee/:id" element={<EmployeeProfile />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
