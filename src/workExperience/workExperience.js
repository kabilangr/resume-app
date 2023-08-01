import React from 'react'
import Navigation from '../navigation/Navigation'
import { WorkExperience as WorkExperienceConst }  from '../utils/Constants'

export const WorkExperience = () => {
  return (
    <div>
      <div className='top-nav'><Navigation currentPage={WorkExperienceConst}/></div>
      <div className="workExperiencePage-container">
        {WorkExperienceConst}
      </div>
    </div>
  )
}