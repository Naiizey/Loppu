import "./story.css";
import { useState, useEffect } from "react";
import Choices from "../../components/choices/choices";
import API from "../../utils/API";
import CharacterSheet from "../../components/characterSheet/characterSheet";
import Loader from "../../components/loader/loader";
import StoryProgress from "../../components/storyProgress/storyProgress";
import CharImage  from '../../assets/images/giant.jpg';
import Button from "../../components/button/button";
import Levenshtein from "../../levenshtein";

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
        localStorage.getItem("sectionId") || defaultSection
    );

    if (localStorage.getItem("sectionId") === null) {
        localStorage.setItem("sectionId", defaultSection);
    }

    useEffect(() => {
        API("sections/" + story_id + "/" + sectionId).then((res) => {
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


    const [characters, setCharacters] = useState();
    const [charactersModels, setCharactersModels] = useState();

    let userChar;
    let userCharModel;

    useEffect(() => {
        API("characters").then((res) => {
            setCharacters(res);
        });

        API("characters_models").then((res) => {
            setCharactersModels(res);
        })
    }, []);

    let inventory = [];
    if(characters && charactersModels){
        let userCharas = characters.filter((elem) => elem.user_id === parseInt(localStorage.getItem("userId")));
        let charModel;
        let character = userCharas.filter((char) => {
            charModel = charactersModels.filter((charModel) => charModel.id === char.character_model_id);
            return char.character_model_id;
        });

        userChar = character[0];
        userCharModel = charModel[0];

        for(let stuffName in userChar.stuff){
            for(let item in userChar.stuff[stuffName]){
                inventory.push(`${item} - ${userChar.stuff[stuffName][item].type}`)
            }
        }
    }

    const dict_combat = ["killing","slaughter","fightin","battlers","attack","defend","defeat","slainers","injure","wounded","smashing","crusher","smiting","sheathing"];

    let text_levenshtein = section.content.action?.text || section.content.text;
    if(typeof text_levenshtein !== "undefined" && section.content.action.type === "combat"){
        text_levenshtein = Levenshtein(text_levenshtein, dict_combat, 2, "#FF0000")
    }

    return (
        <main id="section">
            <nav>
                { userChar && userCharModel && inventory &&
                    <CharacterSheet
                        type="small"
                        name={userCharModel.name}
                        stats={userChar.stats}
                        inventory={inventory}
                        img={CharImage}
                        isClicked={clickedCharacter === `${userCharModel.name}`}
                        onClick={() => handleCharacterClick(`${userCharModel.name}`)}
                    />
                }
            </nav>
            <section>
                <StoryProgress section={sectionId} />
                <article>
                    <p dangerouslySetInnerHTML={{ __html:text_levenshtein }}></p>
                </article>
                <aside>
                    <Choices id={sectionId} setSectionId={setSectionId} />
                    {sectionId === 50 && <Button size="small" type="story" text="End the story" onClick={() => window.location = '/ending'} />}
                </aside>
            </section>
            <Loader loading={section.id === 0} />
        </main>
    );
};

export default SectionPage;
