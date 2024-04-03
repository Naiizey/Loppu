import { useState } from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';

const CharacterSelection = () => {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <section id="characterSelection">
            <h1>Choose your character</h1>
            <ul>
                <CharacterSheet type="big" name="Warrior" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["sword", "shield"]} img="https://via.placeholder.com/150" isClicked={isClicked} onClick={() => setIsClicked(!isClicked)}/>
                <CharacterSheet type="small" name="Mage" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["staff", "spellbook"]} img="https://via.placeholder.com/150" isClicked={isClicked} onClick={() => setIsClicked(!isClicked)}/>
                {/*
                    <CharacterSheet type="big" name="Rogue" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["dagger", "lockpick"]} img="https://via.placeholder.com/150"/>
                */}
            </ul>
        </section>
    )
};

export default CharacterSelection;
