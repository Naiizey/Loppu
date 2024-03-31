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
  const [isSliderOpened, setIsSliderOpened] = useState(true);

  const [sliderType, setSliderType] = useState('user');

  return (
    <Router>
      <Header isSliderOpened={isSliderOpened} setIsSliderOpened={setIsSliderOpened} sliderType={sliderType} setSliderType={setSliderType}/>
      {isSliderOpened && 
        <HeaderSlider type={sliderType} setIsSliderOpened={setIsSliderOpened}/>
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
