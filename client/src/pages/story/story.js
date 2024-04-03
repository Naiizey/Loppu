import './story.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';
import { useState } from 'react';

import Choices from "../../components/choices/choices";
import API from "../../utils/API";
import { useEffect } from "react";

const SectionPage = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
    };

    const [title, setTitle] = useState("");
    const defaultSection = 1;
    const [section, setSection] = useState({
        id: defaultSection,
        id_book_section: 0,
        content: {
            action: {
                text: "",
            },
        },
        image: "",
        story_id: 0,
        title: "",
        type_id: 0,
    });

    const [sectionId, setSectionId] = useState(
        document.cookie.split("sectionId=")[1] || defaultSection
    );

    useEffect(() => {
        API("sections/" + sectionId).then((res) => {
            setSection(res[0]);
        });
    }, [sectionId]);

    useEffect(() => {
        API("stories/" + section.story_id).then((res) => {
            setTitle(res[0]?.title);
        }
        );
    }, [section.story_id]);

    useEffect(() => {
        API("users", "POST", {
            username: "test",
            password: "test",
            email: "test@test.com",
        }).then((res) => {
            console.log(res);
        });
    }, []);

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
                        <h2>{title}</h2>
                        <h3>section {section.id} - village</h3>
                    </div>
                </div>
                <article>
                    <p>
                        {section.content.action.text}
                    </p>
                </article>
            </section>
            <Choices id={sectionId} setSectionId={setSectionId} />
        </main>
    )
};

export default SectionPage;
