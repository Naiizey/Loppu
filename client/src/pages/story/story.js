import "./story.css";
import { useState, useEffect } from "react";
import Choices from "../../components/choices/choices";
import Dices from "../../components/dices/dices";
import API from "../../utils/API";
import CharacterSheet from "../../components/characterSheet/characterSheet";
import Loader from "../../components/loader/loader";
import StoryProgress from "../../components/storyProgress/storyProgress";

const SectionPage = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter((prev) =>
            prev === characterName ? null : characterName
        );
    };

    const [title, setTitle] = useState("");

    const [section, setSection] = useState({
        id: 0,
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

    const story_id = localStorage.getItem("storyId");
    if (story_id == null) {
        localStorage.setItem("storyId", 1);
        story_id = 1;
    }

    const defaultSection = 1;
    const [sectionId, setSectionId] = useState(
        localStorage.getItem("sectionID") || defaultSection
    );

    useEffect(() => {
        API("sections/" + sectionId).then((res) => {
            res = res[0];
            setSection(res);
        });
    }, [sectionId]);

    useEffect(() => {
        API("stories/" + story_id).then((res) => {
            res = res[0];
            setTitle(res.title);
        });
    }, [story_id]);

    return (
        <main id="section">
            {section.id === 0 && <Loader loading={section.id === 0} />}
            <nav>
                <CharacterSheet
                    type="small"
                    name="Mage"
                    stats={{
                        strength: "10",
                        intelligence: "5",
                        resistance: "8",
                        luck: "3",
                    }}
                    inventory={["staff", "spellbook"]}
                    img="https://via.placeholder.com/150"
                    isClicked={clickedCharacter === "Mage"}
                    onClick={() => handleCharacterClick("Mage")}
                />
            </nav>
            <section>
                <StoryProgress section={sectionId} />
                <article>
                    <p>{section.content.action.text}</p>
                </article>
                <aside>
                    <Choices id={sectionId} setSectionId={setSectionId} />
                    <Dices />
                </aside>
            </section>

        </main>
    );
};

export default SectionPage;
