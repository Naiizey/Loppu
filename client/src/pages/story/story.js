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
                    If there is a tick in the above box, you have Been Here Before. Turn to 14. Otherwise, read on. The gates of Boulder Ford are made of thick oak reinforced with iron bands, and set within a sturdy stone gatehouse. Still, that should pose little problem to a determined beast such as yourself. Ignoring the shouts and screams of the Gnomish guards, you proceed to wrench the gates apart. Roll one die. If it is less than your STRENGF score, tick the box above, and turn to 26. If it is equal to or greater than your STRENGF score, you fail to open the gate. Deduct one point from your TUFF score to reflect both your efforts and the Gnomish arrows bouncing off your hardened hide. If your TUFF score is now zero, turn to 13. Otherwise, try again by rolling one die and comparing it to your STRENGF score in the manner above. Keep doing this until you either open the gates, or die trying! Alternatively, you could decide the whole thing is too much hard work and wander back to your cave. If you decide to do this, turn to 50.
                    </p>
                </article>
                <div className="choices">
                    <button>Choice 1</button>
                    <button>Choice 2</button>
                    <button>Choice 3</button>
                </div>
            </section>
        </main>
    )
};

export default SectionPage;
