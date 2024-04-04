import './dices.css';
import Button from '../button/button';
import Dice from 'react-dice-roll';
import { useState } from 'react';

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

function updateDiceValues(diceValue, push = false) {

    let storedDiceValues = localStorage.getItem("diceValues");
    if (storedDiceValues === null) {
        storedDiceValues = [diceValue];
    }
    else {
        storedDiceValues = storedDiceValues.split(",");
        storedDiceValues.push(diceValue);
    }
    localStorage.setItem("diceValues", storedDiceValues)
    
}
// use stat for dice value

const Dices = ({nbDices }) => {
    localStorage.setItem("diceValues", [0]);
    
    const diceElements = [];
    let check = 0;
    for (let i = 0; i < nbDices; i++) {
        diceElements.push(
            <li key={i}><Dice size='100' onRoll={(value) => {console.log('diceValue:' + value); check = i + 1; updateDiceValues(value, check = nbDices)}} /></li>
        );
    }
    
    return (
        <div id="dices">
            <ul>
                {diceElements}
            </ul>
            {/* <Button size="small" type="primary" text="Roll" onClick={rollAllDices}/> */}
        </div>
    )
};

export default Dices;
export { rollAllDices };
