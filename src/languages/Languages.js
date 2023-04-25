import React from 'react'
import Navigation from '../navigation/Navigation'
import { Languages as LanguagesPage }  from '../utils/Constants'

export const Languages = () => {
  return (
    <div className='language-main'>
      <div className='top-nav'><Navigation currentPage={LanguagesPage}/></div>
      <div className="languagesPage-container">
        {LanguagesPage}
      </div>
    </div>
  )
}
