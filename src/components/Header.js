import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";
import { menuData } from "../assets/data/MenuData";
import "../styles.scss"
import {
  Navbar,
   Nav, 
  Form, 
FormControl, Container, Button, Row, Col} from 'react-bootstrap'

const styles = {
  backgroundColor: "#c3c7c4",
  border: "thin solid #077487",
  borderRadius: "5px",
};
const Header = (props) => {
  return (
    <Row>
      <Col style={styles}>
        Image
      </Col>

      <Col style={styles}>
        <Button variant="outline-info">
          <Link to="/journals">Journals</Link>
        </Button>
      </Col>
      <Col style={styles}>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-5" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Col>
      <Col style={styles}>
        <Button variant="outline-info">
          <Link to="/about">About</Link>
        </Button>
        <Button variant="outline-info">
          <Link to="/contact">Contact</Link>
        </Button>
        <Button variant="outline-info">Español</Button>
      </Col>
    </Row>
  );
};

export default Header;
