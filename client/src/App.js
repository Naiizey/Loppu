import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import HomePage from './pages/homePage/homePage'
import Header from './components/header/header'
import CharacterSelection from './pages/characterSelection/characterSelection'

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route
          exact
          path="/"
          element={ <HomePage/> }
        />
        <Route
          path="/characterSelection"
          element={ <CharacterSelection/> }
        />
      </Routes>
    </Router>
  );
}

export default App;
