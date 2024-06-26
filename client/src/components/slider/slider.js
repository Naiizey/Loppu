import UserProfileMenu from './userProfileMenu/userProfileMenu';
import SettingsMenu from './settingsMenu/settingsMenu';
import './slider.css';

const HeaderSlider = ({sliderType, setSliderType, darkMode, setDarkMode, displayMode, setDisplayMode, lineSpace, setLineSpace}) => {
    return (
        <aside className="sliderComponent">
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
