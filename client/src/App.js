import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import './App.css';
import HomePage from './pages/homePage/homePage'
import Header from './components/header/header'
import HeaderSlider from './components/headerSlider/headerSlider';


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
        <HeaderSlider 
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
          element={ <HomePage/> }
        />
      </Routes>
    </Router>
  );
}

export default App;
