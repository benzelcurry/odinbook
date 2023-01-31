// Nav/Header component

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import FriendRequest from '../images/friend-request.svg';
import '../stylesheets/Nav.css';

const Nav = () => {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [query, setQuery] = useState();
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Sends token to server for persistent log in verification
  useEffect(() => {
    const body = { token: localStorage.getItem('token') }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/`, body)
      .then((response) => {
        setName(response.data.name);
        setUsername(response.data.username);
      })
  }, [token])

  // Handles the search query
  const handleQuery = (e) => {
    setQuery(e.target.value);
  }

  // Redirects to search results page when search query is entered
  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: { query: query } });
  }

  // Logs user out
  const handleClick = (e) => {
    localStorage.clear();
    navigate(0);
  }

  return (
    <div className='header'>
      <div className="nav-left">
        <Link to={'/'} className='nav-link'>
          <button className='site-title'>Benzelbook</button>
        </Link>
        <form action="" onSubmit={(e) => handleSearch(e)}>
            <input type="text" placeholder='Search Benzelbook' className='nav-search' 
              onChange={(e) => handleQuery(e)}
            />
        </form>
      </div>
      <div className="nav-right">
        { name ?
          <div>
            <Link to={'/friend-requests'} className='nav-link'>
              <img src={FriendRequest} alt="Friend requests icon" className='fr-nav' />
            </Link>
            <Link to={`/user/${username}`} className='nav-link'>
              <button className='nav-btn'>{name}</button>
            </Link>
            <button className='nav-btn' onClick={() => handleClick()}>Log Out</button>
          </div>
          : 
          <div>
            <Link to={'/signup'} className='nav-link'>
              <button className='signup-btn nav-btn'>Sign Up</button>
            </Link>
            <Link to={'/login'} className='nav-link'>
              <button className='login-btn nav-btn'>Log In</button>
            </Link>
          </div>
        }
      </div>
    </div>
  );
};

export default Nav;