import './userProfileMenu.css'
import Input from '../../input/input'

const UserProfileMenu = () => {
    return (
        <div className="userMenu">
            <h2>Account parameters</h2>
            <hr/>
            <section>
                <Input label="Username" placeholder="username"/>
                <Input label="Email" placeholder="email" />
            </section>
            <hr/>
            <section>
                <Input label="New Password" type="password" placeholder="newPassword" />
                <Input label="Confirm new Password" type="password" placeholder="confirmNewPassword" />
            </section>
            <hr/>
            <section>
                <div>
                    <h4>Two-factor authentication</h4>
                </div>
            </section>
            <section>

            </section>
        </div>
    )
}

export default UserProfileMenu