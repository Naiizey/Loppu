import './credits.css';

const Credits = () => {
    return (
        <main id="credits">
            <h1>Credits</h1>
            <ul>
                <li>
                    <p>Maquettage</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
                <li>
                    <p>Docker</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
                <li>
                    <p>Frontend</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
                <li>
                    <p>Backend</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
                <li>
                    <p>Base de données</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
                <li>
                    <p>Présentation</p>
                    <p>Alexandre, Lucien, Mathis, Florian, Gabin</p>
                </li>
            </ul>
            <div class="buttons">
                <button onClick={() => window.location.href = '/'}>Back</button>
            </div>
        </main>
    );
};

export default Credits;