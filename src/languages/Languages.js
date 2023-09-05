import React, {useState} from 'react'
import Navigation from '../navigation/Navigation'
import { Languages as LanguagesPage }  from '../utils/Constants'
import { ImageUtil } from "../utils/ImageUtil"
import './Languages.css';

export const Languages = () => {

  const [checked,setChecked] = useState(false)
  return (
    <div className='language-main'>
      <div className='top-nav'><Navigation currentPage={LanguagesPage}/></div>
      <div className="languagesPage-container">
        <div className='background-box-lang'>
          <section className='top-Section-lang'>
            <div className="dial-container">
            <input checked={checked} onClick={() => setChecked(prev => !prev)} className="menu-toggler" type="checkbox"/>
            <label for="menu-toggler"></label>
            <ul className="menu-list-item">
              <li className="menu-item"><image style={{"width":20,"height":20}} src={ImageUtil.reactjsLogo} /></li>
              <li className="menu-item">asdsd</li>
              <li className="menu-item">dsf</li>
              <li className="menu-item">dsfs</li>
              <li className="menu-item">dsf</li>
              <li className="menu-item">sdf</li>
              </ul>
            </div>
            <div className="notes-data-container">

            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
