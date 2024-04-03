import './storiesDisplay.css'
import Button from '../button/button';
import StoryProgress from '../storyProgress/storyProgress'
import CharacterSheet from '../characterSheet/characterSheet'
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow.svg'

const StoriesDisplay = ({storyId, Image, name, isStarted, isClicked, onClick}) => {
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
            <CharacterSheet type="small" name="Warrior" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["sword", "shield"]} img="https://via.placeholder.com/150"/>
            { isClicked === storyId &&
                <div className="storyDetails">
                    <StoryProgress />
                    <Button size="small" Icon={ArrowIcon} text="Continue my story" type="dark" onClick={() => {
                        let cookiesTime = new Date();
                        cookiesTime = cookiesTime.setDate(cookiesTime.getDate() + 14);
                        document.cookie = `storyId=${storyId}; expires=${new Date(cookiesTime).toUTCString()}`;
                        window.location = "/story";
                    }}/>
                </div>
            }
        </div>
    )
}

export default StoriesDisplay;