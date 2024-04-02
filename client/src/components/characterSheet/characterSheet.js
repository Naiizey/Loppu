import React from 'react';
import './characterSheet.css';

function click(name) {
    console.log(name);
}

const characterSheet = ({img, name, stats, inventory}) => {
    return (
        <li id="characterSheet">
            <img src={img} alt={name}/>
            <h2>{name}</h2>
            <ul>
                <li>
                    <p>Strength: </p>
                    <p>{stats.strength}</p>
                </li>
                <li>
                    <p>Intelligence: </p>
                    <p>{stats.intelligence}</p>
                </li>
                <li>
                    <p>Resistance: </p>
                    <p>{stats.resistance}</p>
                </li>
                <li>
                    <p>Luck: </p>
                    <p>{stats.luck}</p>
                </li>
            </ul>
            <hr/>
            <p>Inventory:</p>
            <ul>
                {inventory.map((item, index) => {
                    return <li key={index}>{item}</li>
                })}
            </ul>
            <button onClick={click(name)}>Choisir</button>
        </li>
    )
};

export default characterSheet;