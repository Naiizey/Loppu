import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Home from './pages/home/home'
import Story from './pages/story/story'
import Slider from './components/slider/slider';
import Ending from './pages/ending/ending';
import CharacterSelection from './pages/characterSelection/characterSelection';

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

                { localStorage.getItem('userId') && localStorage.getItem('charaId') && (
                    <Route
                        exact
                        path="/story"
                        element={ <Story/> }
                    />
                )}

                <Route
                    path="*"
                    element={ <Navigate to="/"/>}
                />

                <Route
                    exact
                    path="/ending"
                    element={ <Ending/>}
                />

                { localStorage.getItem('fromStoriesDisplay') && (
                        <Route
                            exact
                            path="/createChar"
                            element={ <CharacterSelection storyId={localStorage.getItem('tmpStoryId')}/>}
                        />
                    )
                }
            </Routes>
        </div>
    )
}

export default Main;
