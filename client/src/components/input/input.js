import { useState } from 'react'

import './input.css'
import { ReactComponent as PasswordVisible } from '../../assets/icons/passwordVisible.svg'
import { ReactComponent as PasswordHidden } from '../../assets/icons/passwordHidden.svg'

const Input = ({label, type, placeholder}) => {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);

    const [inputType, setInputType] = useState(type || "");

    return (
        <div className="inputComponent">
            <h4>{label}</h4>
            <div className="inputContainer">
                <input type={inputType} placeholder={placeholder || ""}></input>
                { type === "password" && isPasswordVisible &&
                    <PasswordHidden onClick={() => {
                        setInputType("password");
                        setPasswordVisibility(!isPasswordVisible);
                    }}/>
                }
                { type === "password" && !isPasswordVisible &&
                    <PasswordVisible onClick={() => {
                        setInputType("text");
                        setPasswordVisibility(!isPasswordVisible);
                    }}/>
                }
            </div>
        </div>
    );
}

export default Input;