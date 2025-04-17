/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { navbarBrand, navs } from "../../config/config";
import logoImage from "../Images/logoImage.png";

import {
  btnColor,
  formInput,
  logo,
  nav,
  navBar,
  navBrand,
  closeBtn,
  searchForm,
} from "./index";
import { NavLink } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const navRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const username = localStorage.getItem("userName") || null;

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchQuery}`);
    setSearchQuery("");
    setIsCollapsed(true);
  };

  const handleNavClick = () => {
    setIsCollapsed(true);
  };

  const logout = () => {
    localStorage.removeItem("userName");
    navigate('/');
  }

  const isSearchButtonDisabled = searchQuery.trim() === "";

  return (
    <>
      <Navbar
        ref={navRef}
        style={navBar}
        variant="dark"
        expand="lg"
        fixed="top"
        expanded={!isCollapsed}
      >
        <Navbar.Brand style={navBrand} href="/">
          <img src={logoImage} alt="Logo" style={logo} />
          {navbarBrand}
        </Navbar.Brand>
        {isCollapsed && (
          <Navbar.Toggle
            className="border-0"
            aria-controls="basic-navbar-nav"
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}

        {!isCollapsed && (
          <IoCloseOutline
            size={40}
            style={closeBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        )}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={nav} className="mr-auto" onClick={handleNavClick}>
            {navs.map((navItem) => (
              <LinkContainer to={navItem.page} key={uuidv4()}>
                <Nav.Link className="ml-2">{navItem.nav}</Nav.Link>
              </LinkContainer>
            ))}
          </Nav>
          <Form style={searchForm} onSubmit={handleSubmit}>
            <FormControl
              type="text"
              placeholder="sodhva mate"
              style={formInput}
              className="form-control-lg bg-dark mt-lg-2 mt-md-2 mt-sm-2 mt-xl-0 text-white shadow-sm border-dark"
              value={searchQuery}
              onChange={handleInputChange}
            />
            <a
              className="btn custom-btn mt-lg-2 ml-2 mt-md-2 mt-sm-2 mt-xl-0 btn-primary"
              onClick={handleSubmit}
              disabled={isSearchButtonDisabled}
            >
              Search
            </a>

            {username != null ? (
              username
            ) : (
              <NavLink to={"/user/login"}>
                <a
                  href="/user/login"
                  class="btn custom-btn mt-lg-2 ml-2 mt-md-2 mt-sm-2 mt-xl-0 btn-outline-primary"
                >
                  Login
                </a>
              </NavLink>
            )}

            {username != null ? <button className="btn custom-btn mt-lg-2 ml-2 mt-md-2 mt-sm-2 mt-xl-0 btn-outline-primary" onClick={logout} >Logout</button> :  <NavLink to={"/user/register"}>
              <a
                href="/user/register"
                class="btn custom-btn mt-lg-2 ml-2 mt-md-2 mt-sm-2 mt-xl-0 btn-outline-primary"
              >
                Signup
              </a>
            </NavLink>}
           
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavBar;
