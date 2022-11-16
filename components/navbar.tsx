import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  async function checkLogin() {
    const user = await getSession();
    if (user) setIsLoggedIn(true);
  }

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/login");
  }

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand onClick={() => router.push("/")}>
          Appointment App
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">
          {isLoggedIn ? (
            <>
              <Nav.Link
                className="m-3 text-white"
                onClick={() => router.push("/")}
              >
                Home
              </Nav.Link>
              <Nav.Link className="m-3 text-white" onClick={()=>router.push('/book')}>Add Appointment</Nav.Link>
              <Nav.Link className="m-3 text-white">View Profile</Nav.Link>
              <Nav.Link className="m-3 text-white" onClick={handleSignOut}>
                Sign Out
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                className="m-3 text-white"
                onClick={() => router.push("/login")}
              >
                Login
              </Nav.Link>
              <Nav.Link
                className="m-3 text-white"
                onClick={() => router.push("/signup")}
              >
                Register
              </Nav.Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
