import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <div className='nav-bar'>
      <ul>
        <li>
          <NavLink to="/">GoalBloom</NavLink>
        </li>
        <li>
          <Link to={`/transactions`} className="transactions-page">My Transactions</Link>
        </li>
        <li>
          <ProfileButton />
        </li>
      </ul>
    </div>
    
  );
}

export default Navigation;
