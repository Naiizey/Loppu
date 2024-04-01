import './userProfileMenu.css'
import Input from '../../input/input'
import SliderButton from '../sliderButton/sliderButton'

import { ReactComponent as DisconnectIcon } from '../../../assets/icons/disconnect.svg' 
import { ReactComponent as DataIcon } from '../../../assets/icons/data.svg' 
import { ReactComponent as DeleteIcon } from '../../../assets/icons/delete.svg' 

const UserProfileMenu = () => {
    return (
        <div className="userMenu">
            <h2>Account parameters</h2>
            <hr/>
            <section className="userInfos">
                <Input label="Username" placeholder="username"/>
                <Input label="Email" placeholder="email" />
            </section>
            <hr/>
            <section className="password">
                <Input label="New Password" type="password" placeholder="newPassword" />
                <Input label="Confirm new Password" type="password" placeholder="confirmNewPassword" />
            </section>
            <hr/>
            <section className="utils">
                <div>
                    { /* <h4>Two-factor authentication</h4> */ }
                    <SliderButton type='danger' Icon={DisconnectIcon} text='Disconnect'/>
                    <SliderButton type='info' Icon={DataIcon} text='Recover my data'/>
                    <SliderButton type='danger' Icon={DeleteIcon} text='Delete my account'/>
                </div>
            </section>
        </div>
    )
}

export default UserProfileMenu