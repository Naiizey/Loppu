import './dices.css';
import Button from '../button/button';
import Dice from 'react-dice-roll';

function rollAllDices() {
    let buttons = document.querySelectorAll("#dices ul button");
    buttons.forEach((button, index) => {
        setTimeout(() => {
            button.click();
        }, index * 200);
    });
}

const Dices = ({nbDices}) => {
    const diceElements = [];
    for (let i = 0; i < nbDices; i++) {
        diceElements.push(
            <li><Dice size='100' onRoll={(value) => console.log('diceValue:' + value)} /></li>
        );
    }
    return (
        <div id="dices">
            <ul>
                {diceElements}
            </ul>
            <Button size="small" type="primary" text="Roll" onClick={rollAllDices}/>
        </div>
    )
};

export default Dices;
