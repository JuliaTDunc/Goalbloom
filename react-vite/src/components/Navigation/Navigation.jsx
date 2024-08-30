import { NavLink, Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
    <li>
        <Link to={`/transactions`} className="transactions-page">My Transactions</Link>
    </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
