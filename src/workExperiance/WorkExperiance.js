import React from 'react'
import Navigation from '../navigation/Navigation'
import { WorkExperiance as WorkExperiancePage }  from '../utils/Constants'

export const WorkExperiance = () => {
  return (
    <div>
      <div className='top-nav'><Navigation currentPage={WorkExperiancePage}/></div>
      <div className="workExperiancePage-container">
        {WorkExperiancePage}
      </div>
    </div>
  )
}