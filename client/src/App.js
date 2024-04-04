import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import './App.css';
import Main from './Main'

import Header from './components/header/header'
import Main from './Main'



function App() {
  const [isSliderOpened, setIsSliderOpened] = useState(false);

  const [sliderType, setSliderType] = useState();

  const [darkMode, setDarkMode] = useState(true);
  
  /* useStates for future implementations
  const [displayMode, setDisplayMode] = useState("simple");

  const [lineSpace, setLineSpace] = useState(1);

  Add this to Main & Slider :
    darkMode={darkMode} setDarkMode={setDarkMode} 
    displayMode={displayMode} setDisplayMode={setDisplayMode}
    lineSpace={lineSpace} setLineSpace={setLineSpace}
  */

  return (
    <Router>
      <Header isSliderOpened={isSliderOpened} setIsSliderOpened={setIsSliderOpened} sliderType={sliderType} setSliderType={setSliderType}/>
      <Main 
        sliderType={sliderType} setSliderType={setSliderType}
        isSliderOpened={isSliderOpened} setIsSliderOpened={setIsSliderOpened}
        darkMode={darkMode} setDarkMode={setDarkMode} 
      />
    </Router>
  );
}

export default App;
