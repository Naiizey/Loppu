import UserProfileMenu from './userProfileMenu/userProfileMenu';
import SettingsMenu from './settingsMenu/settingsMenu';
import {ReactComponent as CloseCross} from '../../assets/icons/cross.svg'
import './headerSlider.css';

const HeaderSlider = ({type, setIsSliderOpened}) => {
    return (
        <aside className="slider">
            <CloseCross onClick={() => setIsSliderOpened(false)}/>
            {
                type === 'user' &&
                <UserProfileMenu/>
            }
            {
                type === 'settings' && 
                <SettingsMenu/>
            }
        </aside>
    )
};

export default HeaderSlider;
