import './home.css';

const HomePage = () => {
    return (
        <main id="home">
            <h1>Welcome to Loppu !</h1>
            <div class="buttons">
                <button>Play</button>
                <button onClick={() => window.location.href = '/Credits'}>Credits</button>
            </div>
        </main>
    )
};

export default HomePage;
