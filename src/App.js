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
    <Router>
      <div className="App">
          <Routes>
            <Route path="/" exact element={<Navigate to="/home" replace={true}/>}/>
            <Route path="/home" exact element={<Home/>}/>
            <Route path="/languages" exact element={<Languages/>}/>
            <Route path="/workExperience" exact element={<WorkExperience/>}/>
            <Route path="/projects" exact element={<Projects/>}/>
            <Route path="/about" exact element={<About/>}/>
            <Route path="/contact" exact element={<Contact/>}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App;
