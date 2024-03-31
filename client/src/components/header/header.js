import './header.css';
import {ReactComponent as AccountIcon} from '../../assets/images/account.svg';
import {ReactComponent as HomeIcon} from '../../assets/images/home.svg';
import {ReactComponent as LoppuLogo} from '../../assets/images/loppu.svg';
import {ReactComponent as SettingsIcon} from '../../assets/images/settings.svg';

const Header = ({isSliderOpened, setIsSliderOpened, sliderType, setSliderType}) => {
    const toggleSlider = (type) => {
        if(isSliderOpened && sliderType === type){
            setIsSliderOpened(!isSliderOpened);
        }
        else if(isSliderOpened && sliderType !== type){
            setSliderType(type);
        }
        else{
            setIsSliderOpened(!isSliderOpened);
            setSliderType(type)
        }
    }
    
    return (
        <header>
            <div>
                <a href="/" id="loppu"><LoppuLogo/></a>
                <nav>
                    <ul>
                        <li><a href="/"><HomeIcon/></a></li>
                        <li onClick={() => {
                            toggleSlider("user");
                        }}><AccountIcon/></li>
                        <li onClick={() => {
                            toggleSlider("settings");
                        }}><SettingsIcon/></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
};

export default Header;
