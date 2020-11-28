import React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";

const Header = styled.header`
  color: #0b3687;
  font-weight: 700;
  position: fixed;
  top: 0;
  left: 0;
  width: 10%;
  min-width: 150px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  background-color: #0b3687;
  z-index: 10;
  box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);
`;

const List = styled.ul`
  width: 90%;
  display: flex;
  flex-direction: column;
`;

const Item = styled.li`
  width: 100%;
  min-width: 120px;
  height: 30px;
  margin: 20px 0;
  border-radius: 5px;
  background-color: #fddc01;
`;

const SLink = styled(Link)`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const header = () => (
  <Header>
    <List>
      <Item>
        <SLink to="/">TRANSACTION</SLink>
      </Item>
      <Item>
        <SLink to="/search">SEARCH</SLink>
      </Item>
    </List>
  </Header>
);

export default withRouter(header);
