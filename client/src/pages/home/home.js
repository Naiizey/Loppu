import './home.css';
import StoriesDisplay from '../../components/storiesDisplay/storiesDisplay';
import Image from '../../assets/images/storiesDisplay.jpg'
import { useState } from 'react';


const HomePage = () => {
    const [isClicked, setIsClicked] = useState(0);

    const handleClick = (storyId) => {
        if(isClicked === storyId){
            setIsClicked(null);
        }
        else{
            setIsClicked(storyId)
        }
    }

    const json = [
        {
            "id":1,
            "title":"RAMPAGE",
            "author":"unknown",
            "description":"unknown",
            "created_at":"2024-04-03T12:38:00.705Z",
            "image": {Image}
        },
        {
            "id":2,
            "title":"RAMPAGE",
            "author":"unknown",
            "description":"unknown",
            "created_at":"2024-04-03T12:38:00.705Z",
            "image": {Image}
        },
    ]    

    return (
        <main id="home">
            <section className="welcomeMessage">
                <h1>Welcome back to Loppu !</h1>
                <h2>My stories</h2>
            </section>
            <section className="storiesList">
                {
                    json.map(story => (
                        <StoriesDisplay key={story.id} storyId={story.id} Image={story.image.Image} name={story.title} isStarted={true} isClicked={isClicked} onClick={() => {handleClick(story.id)}}/>
                    ))
                }
            </section>
        </main>
    )
};

export default HomePage;
