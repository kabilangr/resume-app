import React from 'react'
import Navigation from '../navigation/Navigation'
import { Projects as ProjectsPage }  from '../utils/Constants'

export const Projects = () => {
  return (
    <div>
      <div className='top-nav'><Navigation currentPage={ProjectsPage}/></div>
      <div className="projectsPage-container">
        {ProjectsPage}
      </div>
    </div>
  )
}
