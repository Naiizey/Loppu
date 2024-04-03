import React from 'react';
import './characterSheet.css';

const characterSheet = ({type, img, name, stats, inventory, isClicked, onClick}) => {
    switch(type) {
        case "big":
            return (
                <li id="characterSheetBig" className={`${isClicked ? "selected" : ""}`}   onClick={onClick}>
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
                    <div id="arrowDownWhite">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 15.5l-6.5-6.5 1.5-1.5 5 5 5-5 1.5 1.5z"/></svg>
                    </div>
                    { isClicked &&
                        <article>
                            <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo
                            </p>
                            <button>Choose</button>
                        </article>
                    }
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