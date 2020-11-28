import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Home from "../Routes/Home";
import Search from "../Routes/Search";
import Header from "./Header";

const router = () => (
  <Router>
    <Header />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/search" component={Search} />
      <Redirect from="*" to="/" />
    </Switch>
  </Router>
);

export default router;
