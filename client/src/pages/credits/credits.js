import './credits.css';

const Credits = () => {
    return (
        <main id="credits">
            <h1>Credits</h1>
            <ul>
                <li>Game Design: <span>Yannick Brouillette</span></li>
                <li>Programming: <span>Yannick Brouillette</span></li>
                <li>Art: <span>Yannick Brouillette</span></li>
                <li>Music: <span>Yannick Brouillette</span></li>
                <li>Sound: <span>Yannick Brouillette</span></li>
            </ul>
            <div class="buttons">
                <button onClick={() => window.location.href = '/'}>Back</button>
            </div>
        </main>
    );
};

export default Credits;