import './storiesDisplay.css'
import Button from '../button/button';
import StoryProgress from '../storyProgress/storyProgress'
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow.svg'

const StoriesDisplay = ({Image, name, isStarted, isClicked, onClick}) => {
    return(
        <div className={`storiesDisplayComponent ${isClicked ? "clicked" : ""}`} onClick={onClick}>
            <div className="storyInfos">
                <h4>{name}</h4>
                { isStarted &&
                    <p>Continue my story</p>
                }
                <img src={Image} alt="story illustration"></img>
            </div>
            { isClicked &&
                <div className="storyDetails">
                    <StoryProgress />
                    <Button size="small" Icon={ArrowIcon} text="Continue my story" type="dark"/>
                </div>
            }
        </div>
    )
}

export default StoriesDisplay;