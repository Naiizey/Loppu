import './storyProgress.css';

const StoryProgress = ({section}) => {
    return (
        <div className="storyProgressComponent">
            <div>
                <ol>
                    <li>
                        <p>1</p>
                        <p>Genesis</p>
                    </li>
                    <li>
                        <p>2</p>
                        <p>Tavern</p>
                    </li>
                    <li>
                        <p>3</p>
                        <p>Village</p>
                    </li>
                    <hr/>
                </ol>
                <hr/>
            </div>
            <div>
                <h2>Rampage</h2>
                <h3>section {section}</h3>
            </div>
        </div>
    )
};

export default StoryProgress;
