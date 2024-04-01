import { useState } from 'react';

import './settingsMenu.css'
import { ReactComponent as DayIcon } from '../../../assets/icons/day.svg';
import { ReactComponent as NightIcon } from '../../../assets/icons/night.svg';

import { ReactComponent as DisplayDoubleIcon } from '../../../assets/icons/double.svg';
import { ReactComponent as DisplaySingleIcon } from '../../../assets/icons/page.svg';

import { ReactComponent as AddLineSpace } from '../../../assets/icons/textMoreSpace.svg';
import { ReactComponent as RemoveLineSpace } from '../../../assets/icons/textLessSpace.svg';

import { ReactComponent as AccountIcon } from '../../../assets/icons/account.svg'
import { ReactComponent as KeyboardIcon } from '../../../assets/icons/keyboard.svg'

import RangeInput from '../../rangeInput/rangeInput';
import SliderButton from '../sliderButton/sliderButton';

const SettingsMenu = ({darkMode, setDarkMode, displayMode, setDisplayMode, lineSpace, setLineSpace, setSliderType}) => {
    const [inputValue, setInputValue] = useState(15);

    return (
        <div className="settingsMenu">
            <h2>Settings</h2>
            <hr/>
            <section className="darkMode">
                <h4>Theme</h4>
                <div className="buttonsContainer">
                    <button className={darkMode ? "" : "active"} onClick={() => {setDarkMode(false)}}><DayIcon/> Day</button>
                    <button className={darkMode ? "active" : ""} onClick={() => {setDarkMode(true)}}><NightIcon/> Night</button>
                </div>
            </section>
            <div className="incoming">
                <section className="font">
                    <h4>Font</h4>
                    <input type="select"></input>
                    <RangeInput inputValue={inputValue} setInputValue={setInputValue}/>
                </section>
                <section className="displayProperties">
                    <h4>Page display</h4>
                    <div className="buttonsContainer">
                        <button className={displayMode === "double" ? "active" : ""} onClick={() => {setDisplayMode("double")}}><DisplayDoubleIcon/> Double</button>
                        <button className={displayMode === "simple" ? "active" : ""} onClick={() => {setDisplayMode("simple")}}><DisplaySingleIcon/> Single</button>
                    </div>
                    <div className="buttonsContainer lineSpace">
                        <div className="addLineSpace">
                            <button onClick={() => {setLineSpace(lineSpace + 1)}}><AddLineSpace/></button>
                            <p>Add some line space</p>
                        </div>
                        <div className="removeLineSpace">
                            <button onClick={() => {setLineSpace(lineSpace - 1)}}><RemoveLineSpace/></button>
                            <p>Remove some line space</p>
                        </div>
                    </div>
                </section>
            </div>
            <section className="utils">
                <SliderButton type="info" Icon={AccountIcon} text="Account's settings" onClick={() => {setSliderType("user")}}/>
                <SliderButton type="incoming" Icon={KeyboardIcon} text="Keybindings"/>
            </section>
        </div>
    )
}

export default SettingsMenu;