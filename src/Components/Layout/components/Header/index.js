import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import { Nav, Navbar, Container, Form, Button } from 'react-bootstrap';

const cx = classNames.bind(styles);

function Header() {
  return (
    <>
      {/* fixed="top" */}
      <Navbar className="d-block p-0" bg="light" expand="md">
        <div className={cx('navbar-custom', 'nav-left-fixed')}>
          <Container fluid>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Navbar.Brand href="#home">Pixel Land</Navbar.Brand>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/gallery">Gallery</Nav.Link>
                <Nav.Link href="/contact">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </div>
      </Navbar>
    </>
  );
}

export default Header;
