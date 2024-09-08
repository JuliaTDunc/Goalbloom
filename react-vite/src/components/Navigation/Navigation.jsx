import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import HomeLinkLogo from '../../images/HomeLinkLogo.png'
import "./Navigation.css";

function Navigation() {
  return (
    <div className='nav-bar'>
      <ul>
        <li>
          <NavLink to="/"><img className='HomeLinkLogo' src={HomeLinkLogo}/></NavLink>
        </li>
        <li>
          <ProfileButton />
        </li>
      </ul>
    </div>
    
  );
}

export default Navigation;
