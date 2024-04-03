import { useState } from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';

const CharacterSelection = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    /*

    fichier pour montrer comment implémenter une fiche de personnage
    ne pas inclure dans le projet final !!

    */

    return (
        <section id="characterSelection">
            <h1>Choose your character</h1>
            <ul>
                <CharacterSheet type="big" name="Warrior" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["sword", "shield"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Warrior"} onClick={() => handleCharacterClick("Warrior")}/>

                <CharacterSheet type="small" name="Mage" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["staff", "spellbook"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Mage"} onClick={() => handleCharacterClick("Mage")}/>
                <CharacterSheet type="medium" name="Rogue" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["dagger", "lockpick"]} img="https://via.placeholder.com/150"/>
 
            </ul>
        </section>
    )
};

export default CharacterSelection;
