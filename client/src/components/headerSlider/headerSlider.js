import UserProfileMenu from './userProfileMenu/userProfileMenu';
import SettingsMenu from './settingsMenu/settingsMenu';
import {ReactComponent as CloseCross} from '../../assets/icons/cross.svg'
import './headerSlider.css';

const HeaderSlider = ({sliderType, setSliderType, setIsSliderOpened, darkMode, setDarkMode, displayMode, setDisplayMode, lineSpace, setLineSpace}) => {
    return (
        <aside className="slider">
            <CloseCross onClick={() => setIsSliderOpened(false)}/>
            {
                sliderType === 'user' &&
                <UserProfileMenu/>
            }
            {
                sliderType === 'settings' && 
                <SettingsMenu 
                    darkMode={darkMode} setDarkMode={setDarkMode} 
                    displayMode={displayMode} setDisplayMode={setDisplayMode}
                    lineSpace={lineSpace} setLineSpace={setLineSpace}
                    setSliderType={setSliderType}

                />
            }
        </aside>
    )
};

export default HeaderSlider;
