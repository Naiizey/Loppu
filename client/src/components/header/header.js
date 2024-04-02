import './header.css';
import {ReactComponent as AccountIcon} from '../../assets/images/account.svg';
import {ReactComponent as HomeIcon} from '../../assets/images/home.svg';
import {ReactComponent as LoppuLogo} from '../../assets/images/loppu.svg';
import {ReactComponent as SettingsIcon} from '../../assets/images/settings.svg';

const Header = () => {
    return (
        <header>
            <div>
                <a href="/" id="loppu"><LoppuLogo/></a>
                <nav>
                    <ul>
                        <li><a href="/home"><HomeIcon/></a></li>
                        <li><a href="/account"><AccountIcon/></a></li>
                        <li><a href="/settings"><SettingsIcon/></a></li>
                    </ul>
                </nav>
            </div>
            <hr/>
        </header>
    )
};

export default Header;
