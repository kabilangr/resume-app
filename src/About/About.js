import React from 'react'
import Navigation from '../navigation/Navigation'
import { About as AboutPage }  from '../utils/Constants'

export const About = () => {
  return (
    <div>
      <div className='top-nav'><Navigation currentPage={AboutPage}/></div>
      <div className="aboutPage-container">
        {AboutPage}
      </div>
    </div>
  )
}
