import './home.css';
import StoriesDisplay from '../../components/storiesDisplay/storiesDisplay';
import Image from '../../assets/images/storiesDisplay.jpg'
import { useState, useEffect } from 'react';
import API from '../../utils/API'

const HomePage = () => {
    const [isClicked, setIsClicked] = useState(0);
    const [stories, setStories] = useState();

    const handleClick = (storyId, e) => {
        if(e.target.tagName !== "BUTTON"){
            setIsClicked(prev => prev === storyId ? null : storyId);
        }
    }

    useEffect(() => {
        API("stories").then((res) => {
            setStories(res);
        })
    }, []); 

    return (
        <main id="home">
            <section className="welcomeMessage">
                <h1>Welcome back to Loppu !</h1>
                <h2>My stories</h2>
            </section>
            <section className="storiesList">
                { stories && 
                    stories.map(story => (
                        <StoriesDisplay key={story.id} storyId={story.id} Image={Image} name={story.title} isStarted={true} isClicked={isClicked} onClick={(e) => {handleClick(story.id, e)}}/>
                    ))
                }
            </section>
        </main>
    )
};

export default HomePage;
