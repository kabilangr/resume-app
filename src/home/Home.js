import React, { Component, useEffect, useState } from 'react'
import Navigation from '../navigation/Navigation';
import { Home as HomePage }  from '../utils/Constants';
import topIcon from "../assets/scroll-to-top.png"
import './Home.css';


const Home = () => {
    const [showButton, setShowButton] = useState(false)
    const [showScrollBar,setShowScrollBar] = useState(false)
    useEffect(() => {
        const handleScrollButtonVisiblity = () => {
            window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false);
        };
        window.addEventListener('scroll', handleScrollButtonVisiblity);
        return () => {
            window.removeEventListener('scroll', handleScrollButtonVisiblity);
        };
    }, []);
    const handleScrollToTop = () => {
        window. scrollTo({ top: 0, behavior: 'smooth' });
        };
    return (
        <div className='home-main'>
            <div className='top-nav'><Navigation currentPage={HomePage}/></div>
            <div className="homePage-container">
                <section className='top-Section'>
                    <article className='article typed'>Hi, My name is kabilan.</article>
                    <div className='top-animation'>
                        <div className='top-animation-circle'></div>
                        <div className='top-animation-rectangle'></div>
                    </div>
                </section>
                <section className='top-Section'>
                    <article className='article'>I am a Full-stack Developer.</article>
                </section>
                <section className='top-Section'>
                    <article className='article'>
                        GoodLuck is made by strong Will 
                    </article>
                </section>
            </div>
            {showButton && (
                <div className='scrollToTopContainer'>          
                    <button className="scrollToTopButton" onClick={handleScrollToTop} >
                        <img className='scroll-to-top-icon' src={topIcon} alt="scrollToTop" />
                    </button>
                </div > 
            )} 
        </div>
    )
}

export default Home;