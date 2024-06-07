import React from "react";
import "./characterSheet.css";
import API from '../../utils/API'

// Pour un exemple d'ajout aller voir le fichier characterSelection.js dans les pages

/*
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    <CharacterSheet type="big" name="Warrior" stats={{strength:"10", intelligence:"5", resistance:"8"}} inventory={["sword", "shield"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Warrior"} onClick={() => handleCharacterClick("Warrior")}/>
*/

/**
 * @function characterSheet
 *
 * @param {object} props
 * @param {string} props.type
 * @param {string} props.img
 * @param {string} props.name
 * @param {object} props.character
 * @param {array} props.inventory
 * @param {boolean} props.isClicked
 * @param {function} props.onClick
 *
 * @returns {React.JSX.Element}
 *
 * @description This function takes props as parameters and returns a JSX element.
 */
const characterSheet = ({type, img, name, character, inventory, isClicked, onClick}) => {
    switch(type) {
        case "big":
            return (
                <li id="characterSheetBig" className={`${isClicked ? "selected" : ""}`}   onClick={onClick}>
                    <div>
                        <img src={img} alt={name}/>
                        <section>
                            <ul>
                                <li>
                                    <h2>{name}</h2>
                                </li>
                                <li>
                                    <p>Strength </p>
                                    <p>{character.stats?.strength || character.base_stats.strength}</p>
                                </li>
                                <li>
                                    <p>Intelligence </p>
                                    <p>{character.stats?.intelligence || character.base_stats.intelligence}</p>
                                </li>
                                <li>
                                    <p>Resistance </p>
                                    <p>{character.stats?.resistance || character.base_stats.resistance}</p>
                                </li>
                            </ul>
                        </section>
                        <div className="arrowWhite">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                        </div>
                    </div>
                    { isClicked && character &&
                        <article>
                            <p>
                                { character.description }
                            </p>
                            <button onClick={async () => {
                                console.log(character.name);

                                const newCharacter = await API("characters", "POST", {
                                    "stats": JSON.stringify(character.base_stats),
                                    "character_model_id": character.id,
                                    "stuff": JSON.stringify(character.base_stuff),
                                    "user_id": localStorage.getItem('userId')
                                }).then(resp => resp.result)

                                console.log(newCharacter)

                                localStorage.setItem('storyId', localStorage.getItem('tmpStoryId'));
                                localStorage.setItem('sectionId', 1);
                                localStorage.removeItem('tmpStoryId');

                                localStorage.setItem('charaId', newCharacter.id);
                                localStorage.removeItem('fromStoriesDisplay');
                                window.location = "/story";
                            }}>Select</button>
                        </article>
                    }
                </li>
            )
        case "medium":
            return (
                <li id="characterSheetMedium" className={`${isClicked ? "selected" : ""}`}   onClick={onClick}>
                    <img src={img} alt={name}/>
                    <p>Inventory </p>
                    <ul>
                        {inventory.map((item, index) => {
                            return <li key={index}><span>{item.split(" - ")[0]}</span><span>{item.split(" - ")[1]}</span></li>
                        })}
                    </ul>
                </li>
            )
        case "small":
            return (
                <li className={`characterSheetSmall${isClicked ? " selected" : ""}`}   onClick={onClick}>
                    <img src={img} alt={name}/>
                    <section>
                        <h2>{name}</h2>
                        <ul>
                            <li>
                                <p>Strength </p>
                                <p>{character.stats?.strength || character.base_stats.strength}</p>
                            </li>
                            <li>
                                <p>Intelligence </p>
                                <p>{character.stats?.intelligence || character.base_stats.intelligence}</p>
                            </li>
                            <li>
                                <p>Resistance </p>
                                <p>{character.stats?.resistance || character.base_stats.resistance}</p>
                            </li>
                        </ul>
                    </section>
                    { isClicked &&
                    <>
                        <hr/>
                        <p>Inventory </p>
                        <ul>
                            {
                            inventory.map((item, index) => {
                                return <li key={index}><span>{item.split(" - ")[0]}</span><span>{item.split(" - ")[1]}</span></li>
                            })
                            }
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
