import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

//import Header from 'components/header'
import './App.css';

import HomePage from './pages/homePage/homePage'

function App() {
  return (
    <Router>
      { /*<Header></Header>*/ }
      <Routes>
        <Route 
          exact
          path="/"
          element={ <HomePage/> }
        />{ /* Main page */}
      </Routes>
    </Router>
  );
}

export default App;
