import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';

import Header from './components/header/header'
import Slider from './components/slider/slider';
import Home from './pages/home/home'
import Story from './pages/story/story'

function App() {
  const [isSliderOpened, setIsSliderOpened] = useState(false);

  const [sliderType, setSliderType] = useState();

  const [darkMode, setDarkMode] = useState(true);

  const [displayMode, setDisplayMode] = useState("simple");

  const [lineSpace, setLineSpace] = useState(1);

  return (
    <Router>
      <Header isSliderOpened={isSliderOpened} setIsSliderOpened={setIsSliderOpened} sliderType={sliderType} setSliderType={setSliderType}/>
      {isSliderOpened && 
        <Slider 
          sliderType={sliderType} setSliderType={setSliderType}
          setIsSliderOpened={setIsSliderOpened} 
          darkMode={darkMode} setDarkMode={setDarkMode} 
          displayMode={displayMode} setDisplayMode={setDisplayMode}
          lineSpace={lineSpace} setLineSpace={setLineSpace}
        />
      }
      <Routes>
        <Route
          exact
          path="/"
          element={ <Home/> }
        />
        <Route
          exact
          path="/story"
          element={ <Story/> }
        />
      </Routes>
    </Router>
  );
}

export default App;
