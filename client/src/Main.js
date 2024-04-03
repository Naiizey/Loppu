import {
    Routes,
    Route,
} from "react-router-dom";

import Home from './pages/home/home'
import Story from './pages/story/story'
import Slider from './components/slider/slider';

const Main = ({isSliderOpened, sliderType, setSliderType, setIsSliderOpened, darkMode, setDarkMode}) => {
    return(
        <div id="mainContainer">
            {isSliderOpened &&
                <Slider 
                    sliderType={sliderType} setSliderType={setSliderType}
                    setIsSliderOpened={setIsSliderOpened}
                    darkMode={darkMode} setDarkMode={setDarkMode}
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
        </div>
    )
}

export default Main;