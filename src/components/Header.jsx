import { useState } from "react";
import safelaneLogo from '../assets/safeLane_logo.svg';
import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { useStore } from "../context/Store";




const Header = () => {
    const [userDropdown, setUserDropdown] = useState(false);
    const navigate = useNavigate();
    const [isLoading] = useState(Cookies.get('safelane-user') === undefined ? true : false);
    const { redirectsToLogin } = useStore();



    const getDropdownStatus = (e) => {
        console.log(e.target.closest('.header__header-user-dropdown'))
    }



    if (isLoading) {
        navigate(`/login`);
    }
    return (
        <>
            <header>
                <div className="basic-grid">
                    <div className="header__menu">
                        <img className="logo" src={safelaneLogo} alt="SafeLane logo" />
                        <ul className="menu">
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""
                                    }
                                >
                                    תמונת מצב
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/inquiries"
                                    className={({ isActive, isPending }) =>
                                        isPending ? "pending" : isActive ? "active" : ""
                                    }
                                >
                                    ניהול פניות
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    {Cookies.get('safelane-user') &&
                        <div
                            className={`header__header-user ${userDropdown ? 'show' : ''}`}
                            onMouseLeave={() => setUserDropdown(false)}


                        >
                            {/* <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"></img> */}
                            <button className="head_18_secondary"
                                onClick={() => setUserDropdown(prevState => !prevState)}

                            >
                                {JSON.parse(Cookies.get('safelane-user')).name}
                            </button>
                            <div className="header__header-user-dropdown">
                                <button className="parag_14_main"
                                    onClick={() => {
                                        redirectsToLogin();
                                    }}
                                >התנתקות</button>
                            </div>
                        </div>
                    }

                </div>
            </header>
            <Outlet />
        </>

    )

}

export default Header; 