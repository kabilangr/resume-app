import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom"
import './App.css'
import Home from "./home/Home"
import {Languages} from "./languages/Languages"
import {WorkExperience} from "./workExperience/workExperience"
import {Projects} from "./projects/Projects"
import {About} from "./About/About"
import {Contact} from "./Contact/Contact"

function App() {
  return (
    <Router basename={window.location.pathname || ''} future={{ v7_startTransition: true }}>
      <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace={true}/>}/>
            <Route path="/home"  element={<Home/>}/>
            <Route path="/languages"  element={<Languages/>}/>
            <Route path="/workExperience"  element={<WorkExperience/>}/>
            <Route path="/projects"  element={<Projects/>}/>
            <Route path="/about"  element={<About/>}/>
            <Route path="/contact"  element={<Contact/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
