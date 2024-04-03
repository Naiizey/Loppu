import React from 'react';
import './characterSheet.css';

function click(name) {
    // console.log(name)
}

const characterSheet = ({type, img, name, stats, inventory, isClicked, onClick}) => {
    switch(type) {
        case "big":
            return (
                <li id="characterSheetBig" className={`${isClicked ? "selected" : ""}`}   onClick={onClick}>
                    <img src={img} alt={name}/>
                    <h2>{name}</h2>
                    <ul>
                        <li>
                            <p>Strength </p>
                            <p>{stats.strength}</p>
                        </li>
                        <li>
                            <p>Intelligence </p>
                            <p>{stats.intelligence}</p>
                        </li>
                        <li>
                            <p>Resistance </p>
                            <p>{stats.resistance}</p>
                        </li>
                        <li>
                            <p>Luck </p>
                            <p>{stats.luck}</p>
                        </li>
                    </ul>
                    <hr/>
                    <p>Inventory </p>
                    <ul>
                        {inventory.map((item, index) => {
                            return <li key={index}>{item}</li>
                        })}
                    </ul>
                    <button onClick={click(name)}>Choisir</button>
                </li>
            )
        case "small":
            return (
                <li id="characterSheetSmall" className={`${isClicked ? "selected" : ""}`}   onClick={onClick}>
                    <img src={img} alt={name}/>
                    <section>
                        <h2>{name}</h2>
                        <ul>
                            <li>
                                <p>Strength </p>
                                <p>{stats.strength}</p>
                            </li>
                            <li>
                                <p>Intelligence </p>
                                <p>{stats.intelligence}</p>
                            </li>
                            <li>
                                <p>Resistance </p>
                                <p>{stats.resistance}</p>
                            </li>
                            <li>
                                <p>Luck </p>
                                <p>{stats.luck}</p>
                            </li>
                        </ul>
                    </section>
                    { isClicked &&
                        <>
                            <hr/>
                            <p>Inventory </p>
                            <ul>
                                {inventory.map((item, index) => {
                                    return <li key={index}>{item}</li>
                                })}
                            </ul>
                        </>
                    }
                </li>
            )
        default:
            return (
                <li id="characterSheet">
                    default case
                </li>
            )
    }
};

export default characterSheet;