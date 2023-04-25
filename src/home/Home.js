import React, { Component } from 'react'
import Navigation from '../navigation/Navigation';
import { Home as HomePage }  from '../utils/Constants';
import './Home.css';


const Home = () => {
    return (
        <div className='home-main'>
            <div className='top-nav'><Navigation currentPage={HomePage}/></div>
            <div className="homePage-container">
                {HomePage}
            </div>
        </div>
    )
}

export default Home;