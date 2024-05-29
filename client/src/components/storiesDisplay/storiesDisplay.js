import './storiesDisplay.css'
import Button from '../button/button';
import StoryProgress from '../storyProgress/storyProgress'
import CharacterSheet from '../characterSheet/characterSheet'
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow.svg'
import { useEffect, useState } from 'react';
import API from '../../utils/API'
import CharImage  from '../../assets/images/giant.jpg'

const StoriesDisplay = ({storyId, Image, name, isStarted, isClicked, onClick}) => {
    const [characters, setCharacters] = useState();
    const [charactersModels, setCharactersModels] = useState();

    let userChar;
    let userCharModel;

    useEffect(() => {
        API("characters").then((res) => {
            setCharacters(res);
        });

        API("characters_models").then((res) => {
            setCharactersModels(res);
        })
    }, []);

    if(characters && charactersModels){
        let userCharas = characters.filter((elem) => elem.user_id === parseInt(localStorage.getItem("userId")));
        let charModel;
        let character = userCharas.filter((char) => {
            charModel = charactersModels.filter((charModel) => charModel.id === char.character_model_id);
            return char.character_model_id;
        });

        userChar = character[0];
        userCharModel = charModel[0];
    }

    return(
        <div className={`storiesDisplayComponent${isClicked === storyId ? " clicked" : ""}`} onClick={onClick}>
            <input hidden id=""></input>
            <div className="storyInfos">
                <h4>{name}</h4>
                { isStarted &&
                    <p>Continue my story</p>
                }
            </div>
            <img src={Image} alt="story illustration"></img>
            { userChar && userCharModel &&
                <CharacterSheet type="small" name={userCharModel.name} stats={userChar.stats} inventory={userChar.stuff} img={CharImage}/>
            }
            { isClicked === storyId &&
                <div className="storyDetails">
                    <StoryProgress section={localStorage.getItem("sectionId")}/>
                    <Button size="small" Icon={ArrowIcon} text="Continue my story" type="dark" onClick={() => {
                        if(!localStorage.getItem("storyId")){
                            localStorage.setItem("storyId", 1);
                        }
                        window.location = "/story";
                    }}/>
                </div>
            }
        </div>
    )
}

export default StoriesDisplay;