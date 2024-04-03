import './home.css';
import StoriesDisplay from '../../components/storiesDisplay/storiesDisplay';
import Image from '../../assets/images/storiesDisplay.jpg'
import { useState } from 'react';


const HomePage = () => {
    const [isClicked, setIsClicked] = useState(false)

    return (
        <main id="home">
            <section className="welcomeMessage">
                <h1>Welcome back to Loppu !</h1>
                <h2>My stories</h2>
            </section>
            <section className="storiesList">
                <StoriesDisplay Image={Image} name="Distortion of Ascalon" isStarted={true} isClicked={true} onClick={(e) => (console.log(e))}/>
                <StoriesDisplay Image={Image} name="Distortion of Ascalon" isStarted={true} isClicked={false}/>
                <StoriesDisplay Image={Image} name="Distortion of Ascalon" isStarted={true} isClicked={true} onClick={(e) => (console.log(e))}/>
            </section>
        </main>
    )
};

export default HomePage;
