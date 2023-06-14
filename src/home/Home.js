import React, { Component, useEffect, useState } from 'react'
import Navigation from '../navigation/Navigation';
import { Home as HomePage }  from '../utils/Constants';
import './Home.css';


const Home = () => {
    const [showButton, setShowButton] = useState(false)
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
                    <article className='article'>
                        GoodLuck is made by strong Will 
                    </article>
                </section>
                <section className='top-Section'>
                    <article className='article'>
                        GoodLuck is made by strong Will 
                    </article>
                </section>
                <section className='top-Section'>
                    <article className='article'>
                        GoodLuck is made by strong Will 
                    </article>
                </section>
            </div>
            {
                showButton && ( <div className = {'scrollToTop '}>          
                                <button className = "fixed bottom-5 right-7 z-50 cursor-pointer p-4"
                            onClick = {handleScrollToTop} >
                            < img src = "/icons/new-up-arrow.png" alt = "scrollToTop" />

                            </button> </div > )} </div>
    )
}

export default Home;