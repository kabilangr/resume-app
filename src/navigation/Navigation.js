import React, { useState } from 'react';
import logoGif from '../assets/KR-black.gif'
import "./Navigation.css";
import logoImg from '../assets/KR-static-black.png'
import crossIcon from "../assets/cross-icon.svg"
import { Link } from 'react-router-dom'
import { Home,
    Languages,
    WorkExperience,
    Projects,
    About,
    Contact
} from "../utils/Constants";
import { COLORS } from "../utils/style"

const Navigation = (props) => {

    const [showNavList, setShowNavList] = useState(false)

    const selectedStyle = (pageName) => {
        return (props.currentPage === pageName)? {
            background : COLORS.secondaryColor,
            color: COLORS.backgroundColor,
            }: null
    }

    const showHideNavList = () => {
        setShowNavList(!showNavList)
    }

    return (
    <div className='navigation-main'>
        <nav className='nav-container'>
                <img className='logo-image' src={logoGif} alt=".logo" />
                <img className="logo-image static" src={logoImg} alt=".logo" />
            <ul className='list-container'>
                <li className='list-data'><Link to={"/home"} style={selectedStyle(Home)} className="link">{Home}</Link></li>
                <li className='list-data'><Link to={"/languages"} style={selectedStyle(Languages)} className="link">{Languages}</Link></li>
                <li className='list-data'><Link to={"/workExperience"} style={selectedStyle(WorkExperience)} className="link">{WorkExperience}</Link></li>
                <li className='list-data'><Link to={"/projects"} style={selectedStyle(Projects)} className="link">{Projects}</Link></li>
                <li className='list-data'><Link to={"/about"} style={selectedStyle(About)} className="link">{About}</Link></li>
                <li className='list-data'><Link to={"/contact"} style={selectedStyle(Contact)} className="link">{Contact}</Link></li>
                {!showNavList &&
                <a class="hamburger-icon" onClick={showHideNavList}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="24" viewBox="0 0 52 24" >
                        <g id="Group_9" data-name="Group 9" transform="translate(-294 -47)">
                            <rect id="Rectangle_3" data-name="Rectangle 3" width="42" height="4" rx="2" transform="translate(304 47)" fill="#f1e9dbff"/>
                            <rect id="Rectangle_5" data-name="Rectangle 5" width="42" height="4" rx="2" transform="translate(304 67)" fill="#f1e9dbff" />
                            <rect id="Rectangle_4" data-name="Rectangle 4" width="42" height="4" rx="2" transform="translate(304 57)" fill="#f1e9dbff"/>
                        </g>
                    </svg>
                </a>}
            </ul>
        </nav>
        { showNavList &&
        <nav className='nav-list'>
                <a class="hamburger-icon" onClick={showHideNavList}>
                    <img className='crossIcon' src={crossIcon} />
                </a>
            <ul>
                <li ><Link to={"/home"} style={selectedStyle(Home)} className="link">{Home}</Link></li>
                <li ><Link to={"/languages"} style={selectedStyle(Languages)} className="link">{Languages}</Link></li>
                <li ><Link to={"/workExperience"} style={selectedStyle(WorkExperience)} className="link">{WorkExperience}</Link></li>
                <li ><Link to={"/projects"} style={selectedStyle(Projects)} className="link">{Projects}</Link></li>
                <li ><Link to={"/about"} style={selectedStyle(About)} className="link">{About}</Link></li>
                <li ><Link to={"/contact"} style={selectedStyle(Contact)} className="link">{Contact}</Link></li>
            </ul>
        </nav>}
    </div>
    )
}

export default Navigation