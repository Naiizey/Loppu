import './userProfileMenu.css';
import Input from '../../input/input';
import SliderButton from '../sliderButton/sliderButton';
import Button from '../../button/button';

import { ReactComponent as DisconnectIcon } from '../../../assets/icons/disconnect.svg';
import { ReactComponent as DataIcon } from '../../../assets/icons/data.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg';

const UserProfileMenu = () => {
    return (
        <div className="userMenuComponent">
            <h2>Account's settings</h2>
            <hr/>
            <section className="userInfos">
                <Input label="Username" placeholder="example"/>
                <Input label="Email" placeholder="you@example.com" />
                <Button size="medium" type="success" text="Change username" />
            </section>
            <hr/>
            <section className="password">
                <Input label="New Password" type="password" placeholder="1234" />
                <Input label="Confirm new Password" type="password" placeholder="1234" />
                <Button size="medium" type="success" text="Change password" />
            </section>
            <hr/>
            <section className="utils">
                { /* <h4>Two-factor authentication</h4> */ }
                <SliderButton type="danger" Icon={DisconnectIcon} text="Disconnect"/>
                <SliderButton type="info" Icon={DataIcon} text="Recover my data"/>
                <SliderButton type="danger" Icon={DeleteIcon} text="Delete my account"/>
            </section>
        </div>
    )
}

export default UserProfileMenu
