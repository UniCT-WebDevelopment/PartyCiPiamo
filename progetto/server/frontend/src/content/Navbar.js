import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import './App.css';
import getSocket from './Socket';

function Navbar() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const socket = getSocket();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios
        .get('/api/auth/verify', { headers: { authorization: token } })
        .then((response) => {
          if (response.status === 200) {
            setUser(response.data.user);
          } else {
            navigate('/login');
          }
        })
        .catch((error) => {
          console.error('Verification error:', error);
          navigate('/login');
        });
    } else {
      // User is not logged in, navigate to login page or show login options
      navigate('/login');
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem('token');
    if (socket) {
      socket.disconnect();
    }
    navigate('/login');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    axios
      .get('/api/events/search', { params: { search: searchTerm } })
      .then((response) => {
        setSearchResults(response.data);
        setDropdownVisible(true);
      })
      .catch((error) => {
        console.error('Search error:', error);
        setDropdownVisible(false);
      });
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setSearchResults([]);
      setDropdownVisible(false);
    } else {
      handleSearch(event);
    }
  };

  return (
    <div className="content-wrapper">
      <nav className="navbar navbar-expand-lg bg-dark fixed-top shadow">
        <div className="container-fluid">
          <a className="navbar-brand" href="/homepage">
            <img
              src="/assets/img/logoNuovo.png"
              alt=""
              className="d-inline-block align-text-top"
              style={{ width: '50px', height: '50px' }}
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/homepage" className="nav-link text-white">
                  Home
                </NavLink>
              </li>
              {user && (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      to="/categorie"
                      className="nav-link dropdown-toggle text-white"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Categorie
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink to="/categorie?c=tutto" className="dropdown-item">
                          Tutte
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/categorie?c=cultura" className="dropdown-item">
                          Cultura
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/categorie?c=concerti" className="dropdown-item">
                          Concerti
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/categorie?c=mostre" className="dropdown-item">
                          Mostre
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/categorie?c=party" className="dropdown-item">
                          Party
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/categorie?c=sport" className="dropdown-item">
                          Sport
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/mappa" className="nav-link text-white">
                      Mappa
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/profilo" className="nav-link text-white">
                      Profilo
                    </NavLink>
                  </li>
                  {user.organizer && (
                    <li className="nav-item">
                      <NavLink to="/organizzatore" className="nav-link text-white">
                        Organizzatore
                      </NavLink>
                    </li>
                  )}
                </>
              )}
            </ul>
            {user ? (
              <form
                className="d-flex position-relative"
                role="search"
                onSubmit={handleSearch}
                ref={searchRef}
              >
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                {dropdownVisible && searchResults.length > 0 && (
                  <ul className="dropdown-menu-mine position-absolute w-100 list-unstyled bg-white rounded-top-1 rounded-bottom-1">
                    {searchResults.map((event, index) => (
                      <div
                        className="dropdown-item-mine text-dark fw-bold text-decoration-none pb-2 pt-2"
                        key={index}
                      >
                        <li>
                          <a
                            className="text-decoration-none text-dark ms-3 fw-bold"
                            href={`/evento?id=${event._id}`}
                          >
                            {event.name}
                          </a>
                        </li>
                      </div>
                    ))}
                  </ul>
                )}
              </form>
            ) : (
              <div className="d-flex align-items-center">
                <NavLink to="/login" className="btn btn-primary">
                  LogIn
                </NavLink>
              </div>
            )}
            {/* Aggiunta della sezione per LogOut e LogIn */}
            <ul className="navbar-nav mb-2 mt-2 mb-lg-0 align-items-lg-center">
              {user && (
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-danger ms-lg-5">
                    LogOut
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <div className="m-5 p-2"></div>
    </div>
  );
}

export default Navbar;
