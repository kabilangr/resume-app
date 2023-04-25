import React from 'react';
import logo from '../logo.svg';
import "./Navigation.css";
import { Link } from 'react-router-dom'
import { Home,
    Languages,
    WorkExperiance,
    Projects,
    About,
    Contact
} from "../utils/Constants";

const Navigation = (props) => {

    const selectedStyle = (pageName) => {
        if(props.currentPage === pageName) {
            return {
                background : "grey",
                color: "white"
            }
        }
        return {
            color: "black",
        }
    }

  return (
    <div className='navigation-main'>
        <nav className='nav-container'>
                <img className='logo-image' src={logo} alt=".logo" />
            <ul className='list-container'>
                <li className='list-data'><Link to={"/home"} style={selectedStyle(Home)} className="link">{Home}</Link></li>
                <li className='list-data'><Link to={"/languages"} style={selectedStyle(Languages)} className="link">{Languages}</Link></li>
                <li className='list-data'><Link to={"/workExperiance"} style={selectedStyle(WorkExperiance)} className="link">{WorkExperiance}</Link></li>
                <li className='list-data'><Link to={"/projects"} style={selectedStyle(Projects)} className="link">{Projects}</Link></li>
                <li className='list-data'><Link to={"/about"} style={selectedStyle(About)} className="link">{About}</Link></li>
                <li className='list-data'><Link to={"/contact"} style={selectedStyle(Contact)} className="link">{Contact}</Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navigation