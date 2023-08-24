import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { UserType } from "../types";
import { Heading } from "@chakra-ui/react";

interface NavbarProps {
  pageSession: UserType;
}

const NavBar = ({ pageSession }: NavbarProps) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    pageSession ? true : false
  );

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand onClick={() => router.push("/")}>
          <Heading size="md">Appointment App</Heading>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-links" />

        <Navbar.Collapse className="justify-content-end" id="navbar-links">
          <Nav>
            {isLoggedIn ? (
              pageSession?.role === "Doctor" ? (
                <>
                  <Nav.Link
                    className="m-3 text-white"
                    onClick={() => router.push("/doctor")}
                  >
                    <Heading size="sm">Home</Heading>
                  </Nav.Link>
                  <Nav.Link
                    className="m-3 text-white"
                    onClick={() => router.push("/doctor/appointments")}
                  >
                    <Heading size="sm">View Appointments</Heading>
                  </Nav.Link>
                  <Nav.Link className="m-3 text-white" onClick={handleSignOut}>
                    <Heading size="sm">Sign Out</Heading>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    className="m-3 text-white"
                    onClick={() => router.push("/")}
                  >
                    <Heading size="sm">Home</Heading>
                  </Nav.Link>
                  <Nav.Link
                    className="m-3 text-white"
                    onClick={() => router.push("/profile")}
                  >
                    <Heading size="sm">Profile</Heading>
                  </Nav.Link>
                  <Nav.Link className="m-3 text-white" onClick={handleSignOut}>
                    <Heading size="sm">Sign Out</Heading>
                  </Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link
                  className="m-3 text-white"
                  onClick={() => router.push("/login")}
                >
                  <Heading size="sm">Login</Heading>
                </Nav.Link>
                <Nav.Link
                  className="m-3 text-white"
                  onClick={() => router.push("/signup")}
                >
                  <Heading size="sm">Register</Heading>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
