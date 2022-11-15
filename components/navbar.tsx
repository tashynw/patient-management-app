import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Appointment App</Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          <Nav.Link className="m-3 text-white">Home</Nav.Link>
          <Nav.Link className="m-3 text-white">Add Appointment</Nav.Link>
          <Nav.Link className="m-3 text-white">View Profile</Nav.Link>
          <Nav.Link className="m-3 text-white">Sign Out</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
