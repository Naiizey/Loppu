import { useState } from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';
import levenshtein from '../../levenshtein';

    /*

    fichier pour montrer comment implémenter une fiche de personnage et l'algo de levenshtein
    ne pas inclure dans le projet final !!

    */

const CharacterSelection = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    let texte = `The tower of Gastromo the Wizard is now little more than a heap of white rubble, from which emanates wisps of sulphurous yellow smoke. You scrabble about in the debris looking for valuables, but succeed only in freeing a demon that must have previously been bound in Gastromo's cellar! It shoots up into the sky, hanging in the air above you, and taking the form of a bulky bat-winged ape with red skin and goat-like horns. "Haha! Free at last!" it howls with demonic glee, before spotting you. "Yes, you'll do! I need to harvest souls for the Dark Master!" Waving a rusty barbed trident in your direction, the Pit Demon swoops down on black wings to attack.`;

    let dictionnaire_combat = ["killing","slaughter","fightin","battlers","attack","defend","defeat","slainers","injure","wounded","smashing","crusher","smiting","sheathing"];

    let texte_used = levenshtein(texte, dictionnaire_combat, 2, "#FF0000");


    return (
        <section id="characterSelection">
            <p dangerouslySetInnerHTML={{ __html: texte_used }}>
            </p>
            <ul>
                <CharacterSheet type="big" name="Warrior" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["sword", "shield"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Warrior"} onClick={() => handleCharacterClick("Warrior")}/>

                <CharacterSheet type="small" name="Mage" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["staff", "spellbook"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Mage"} onClick={() => handleCharacterClick("Mage")}/>
                <CharacterSheet type="medium" name="Rogue" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["dagger", "lockpick"]} img="https://via.placeholder.com/150"/>
 
            </ul>
        </section>
    )
};

export default CharacterSelection;
