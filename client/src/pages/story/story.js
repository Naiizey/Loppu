import './story.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';
import { useState } from 'react';

const SectionPage = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    return (
        <main id="section">
            <nav>
                <CharacterSheet type="small" name="Mage" stats={{strength:"10", intelligence:"5", resistance:"8", luck:"3"}} inventory={["staff", "spellbook"]} img="https://via.placeholder.com/150" isClicked={clickedCharacter === "Mage"} onClick={() => handleCharacterClick("Mage")}/>
            </nav>
            <section>
                <div>
                    <div className="progress">
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
                        <h3>section 2 - village</h3>
                    </div>
                </div>
                <article>
                    <p>
                    </p>
                </article>
            </section>
        </main>
    )
};

export default SectionPage;
