import './dices.css';
import Dice from 'react-dice-roll';


/**
 *
 * @function rollAllDices
 *
 * @returns {number} The total value of all dices rolled.
 *
 * @description This function simulates the rolling of all dices on the page.
 */
async function rollAllDices() {
    let buttons = document.querySelectorAll("#dices ul button");

    // Create an array of promises for each button click
    let buttonClickPromises = Array.from(buttons).map((button, index) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                button.click();
                resolve();
            }, index * 200);
        });
    });

    // Wait for all button clicks to complete
    await Promise.all(buttonClickPromises);
    await new Promise((resolve) => setTimeout(resolve, 1000));


    let diceValues = localStorage.getItem("diceValues");
    localStorage.removeItem("diceValues");
    diceValues = diceValues.split(",");
    let total = diceValues.reduce((a, b) => Number(a) + Number(b), 0);
    return total;
}


/**
 *
 * @function updateDiceValues
 *
 * @param {number} diceValue
 * @param {boolean} push
 *
 * @description This function updates the dice values stored in local storage.
 */
function updateDiceValues(diceValue) {
    let storedDiceValues = localStorage.getItem("diceValues");
    if (storedDiceValues === null) {
        storedDiceValues = [diceValue];
    } else {
        storedDiceValues = storedDiceValues.split(",");
        storedDiceValues.push(diceValue);
    }
    localStorage.setItem("diceValues", storedDiceValues)
}
/**
 *
 * @function Dices
 *
 * @param {number} nbDices
 *
 * @returns {React.JSX.Element}
 *
 * @description This function creates a list of dice elements.
 */
const Dices = ({nbDices, onDiceThrow }) => {
    localStorage.setItem("diceValues", [0]);

    const diceElements = [];
    for (let i = 0; i < nbDices; i++) {
        diceElements.push(
            <li key={i}><Dice size='100' onRoll={(value) => {
                console.log('diceValue:' + value);
                updateDiceValues(value)
            }} /></li>
        );
    }

    return (
        <div id="dices">
            <ul>
                {diceElements}
            </ul>
        </div>
    )
};

export default Dices;
export { rollAllDices };
