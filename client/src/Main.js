import {
    Routes,
    Route,
} from "react-router-dom";

import Home from './pages/home/home'
import Story from './pages/story/story'
import Slider from './components/slider/slider';

const Main = ({isSliderOpened, sliderType, setSliderType, setIsSliderOpened}) => {
    return(
        <div id="mainContainer">
            {isSliderOpened &&
                <Slider 
                    sliderType={sliderType} setSliderType={setSliderType}
                    setIsSliderOpened={setIsSliderOpened} 
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