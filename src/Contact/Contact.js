import React from 'react'
import Navigation from '../navigation/Navigation'
import { Contact as ContactPage }  from '../utils/Constants'

export const Contact = () => {
  return (
    <div>
      <div className='top-nav'><Navigation currentPage={ContactPage}/></div>
      <div className="contactPage-container">
        {ContactPage}
      </div>
    </div>
  )
}
