import { useEffect, useState } from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';
import Image from "../../assets/images/storiesDisplay.jpg";
import API from "../../utils/API"

const CharacterSelection = ({storyId}) => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        localStorage.removeItem('tmpStoryId');
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    const [storyInfos, setStoryInfos] = useState();
    const [characters, setCharacters] = useState();

    useEffect(() => {
        API("stories/" + storyId).then((res) => {
            setStoryInfos(res[0]);
        });

        API("characters_models/story/" + storyId).then((res) => {
            setCharacters(res);
        })
    }, []);

    console.log(characters)

    return (
        <section id="characterSelection">
            { storyInfos &&
                <div id="descriptionSide">
                    <div className="imageContainer">
                        <img src={Image} alt="background"/>
                        <div className="title">{storyInfos.title}</div>
                    </div>
                    <p>{storyInfos.description}</p>
                </div>
            }
            <div id="characterSide">
                <ul>
                    { characters &&
                        characters.map(character => (
                            <CharacterSheet
                                type="big"
                                img={"giant.jpg"}
                                name={character?.name}
                                character={character}
                                inventory={character.stuff}
                                isClicked={clickedCharacter === character.name}
                                onClick={() => handleCharacterClick(character.name)}
                                key={character.name}
                            />
                        ))
                    }
                </ul>
            </div>
        </section>
    )
};

export default CharacterSelection;
