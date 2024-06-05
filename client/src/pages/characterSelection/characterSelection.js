import { useState } from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';
import Image from "../../assets/images/storiesDisplay.jpg";

const CharacterSelection = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };




    return (
        <section id="characterSelection">
            <div id="descriptionSide">
                <div class="imageContainer">
                    <img src={Image} alt="background"/>
                    <div class="title">Titre de l'histoire</div>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien fermentum tincidunt</p>
            </div>
            <div id="characterSide">
                <ul>
                    <CharacterSheet type="big" 
                    img="https://via.placeholder.com/150"
                    name="Brindlebeard"
                    character={{stats: {strength: "10", intelligence: "5", resistance: "8"}}}
                    inventory={["sword", "shield"]}
                    isClicked={clickedCharacter === "Brindlebeard"}
                    onClick={() => handleCharacterClick("Brindlebeard")}
                    />

                    <CharacterSheet type="big" 
                    img="https://via.placeholder.com/150"
                    name="Hagsnot Hilga"
                    character={{stats: {strength: "10", intelligence: "5", resistance: "8"}}}
                    inventory={["sword", "shield"]}
                    isClicked={clickedCharacter === "Hagsnot Hilga"}
                    onClick={() => handleCharacterClick("Hagsnot Hilga")}
                    />

                    <CharacterSheet type="big" 
                    img="https://via.placeholder.com/150"
                    name="Tor The terrible"
                    character={{stats: {strength: "10", intelligence: "5", resistance: "8"}}}
                    inventory={["sword", "shield"]}
                    isClicked={clickedCharacter === "Tor The terrible"}
                    onClick={() => handleCharacterClick("Tor The terrible")}
                    />
                </ul>
            </div>
        </section>
    )
};

export default CharacterSelection;
