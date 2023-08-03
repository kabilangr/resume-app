import React, { useEffect, useState } from 'react'
import Navigation from '../navigation/Navigation';
import { Home as HomePage }  from '../utils/Constants';
import {ImageUtil} from "../utils/ImageUtil"
import Typewriter from "typewriter-effect";
import './Home.css';


const Home = () => {
    const [showButton, setShowButton] = useState(false)
    const [year,setYear] = useState(0)
    useEffect(() => {
        const handleScrollButtonVisibility = () => {
            window.pageYOffset > 50 ? setShowButton(true) : setShowButton(false);
        };
        window.addEventListener('scroll', handleScrollButtonVisibility);
        return () => {
            window.removeEventListener('scroll', handleScrollButtonVisibility);
        };
    }, []);
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    function years ()  {
        let startDate = new Date("11/02/2020")
        let currentDate = new Date()
        let noOfYears = (currentDate - startDate)/(1000 * 60 * 60 * 24*365)
        if(noOfYears >= (Math.floor(noOfYears) + 0.5)){
            setYear((Math.floor(noOfYears) + 0.5))
        } else {
            setYear(Math.floor(noOfYears))
        } 
    }
    useEffect(() => {years ()},[])
    return (
        <div className='home-main'>
            <div className='top-nav'><Navigation currentPage={HomePage}/></div>
            <div className="homePage-container">
            <div className='background-css'>
                <section className='top-Section'>
                    <article className='article'>
                        <h3 className='helloTitle homeText'>Hello, It's me</h3>
                        <h1 className='myName homeText'>Kabilan Ragumurthi</h1>
                        <div className='myJobTitle homeText'><p>I am a </p><Typewriter onInit={(typewriter) => {
                            typewriter
                            .typeString("Front-end developer")
                            .pauseFor(500)
                            .deleteAll()
                            .typeString("Full-stack Developer")
                            .pauseFor(500)
                            .deleteAll()
                            .typeString("Mobile Developer")
                            .pauseFor(500)
                            .deleteAll()
                            .typeString("Software Developer")
                            .start();
                        }} options={{loop:true}} /></div>
                        <p className='content-description'>I'am a Full Stack developer with extensive experience for over {year} years.
                            <br/> Expertise is to create ReactJs, React Native and nodeJs application and more.....
                        </p>
                        </article>
                </section>
                <div className='image-div'>
                    <div className='image-card'>
                        <div className='img-text-container'>
                            <div className='connection-div'>
                                <h3>To Follow Me</h3>
                                <div className='image-container-div'>
                                    <a href='https://www.facebook.com/orc.kabikabilan.7' target='_blank' rel="noreferrer noopener">
                                        <img src={ImageUtil.facebookImage} className='contact-image' />
                                    </a>
                                    <a href='https://www.instagram.com/_known_by_the_name_kabilan_' target='_blank' rel="noreferrer noopener">
                                        <img src={ImageUtil.instagramImage} className='contact-image' />
                                    </a>
                                    <a href='https://www.linkedin.com/in/kabilan-g-r-9749631b5/' target='_blank' rel="noreferrer noopener">
                                        <img src={ImageUtil.linkedInImage} className='contact-image' />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <img src={ImageUtil.kabilanImage} className='myImage' alt='MyImage'/>
                    </div>
                </div>
                </div>
            </div>

            {showButton && (
                <div className='scrollToTopContainer'>          
                    <button className="scrollToTopButton" onClick={handleScrollToTop} >
                        <img className='scroll-to-top-icon' src={ImageUtil.topIcon} alt="scrollToTop" />
                    </button>
                </div > 
            )} 
        </div>
    )
}

export default Home;