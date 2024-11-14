import React from 'react';
import { Navbar, Container, Nav, Form, Row, Col, Button } from 'react-bootstrap';


const NavBar = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container >
        <Navbar.Brand href="/">Finance Dashboard</Navbar.Brand>
        <Nav className="me-auto">
        <Nav.Link href="/indices">Index Data</Nav.Link>
        <Nav.Link href="/forex">Forex Data</Nav.Link>
        </Nav>
        <Form inline>
          <Row>
          <Col xs="auto">
            <Form.Control
              name="query"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </Col>
          <Col xs="auto">
            <Button variant="outline-success" type="submit">Search</Button>
          </Col>
          </Row>
        </Form>
      </Container>
    </Navbar>
  );
};

export default NavBar;
