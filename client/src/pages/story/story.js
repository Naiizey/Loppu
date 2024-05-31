import "./story.css";
import { useState, useEffect } from "react";
import Choices from "../../components/choices/choices";
import Dices from "../../components/dices/dices";
import API from "../../utils/API";
import CharacterSheet from "../../components/characterSheet/characterSheet";
import Loader from "../../components/loader/loader";
import StoryProgress from "../../components/storyProgress/storyProgress";
import CharImage from "../../assets/images/giant.jpg";
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
    setSectionId(localStorage.getItem("sectionId"));
  }, [section]);

  useEffect(() => {
    API("sections/" + story_id + "/" + sectionId).then((res) => {
      res = res[0];
      API("paths/" + parseInt(localStorage.getItem("charaId"))).then(
        (pathRes) => {
          let boolean = false;
          pathRes.forEach((path) => {
            if (parseInt(path["id_sections"]) === res.id) {
              boolean = true;
            }
          });
          if (res.content.action !== undefined) {
            if (res.content.action.alreadyVisited !== undefined) {
              if (boolean && res.content.action.alreadyVisited) {
                API(
                  "sections/" +
                    story_id +
                    "/" +
                    res.content.action.alreadyVisited
                ).then((secRes) => {
                  secRes = secRes[0];
                  localStorage.setItem("sectionId", secRes.id);
                  setSection(secRes);
                });
              } else {
                setSection(res);
              }
            } else {
              setSection(res);
            }
          }
        }
      );
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
  const [userChar, setUserChar] = useState();
  const [userCharModel, setUserCharModel] = useState();

  useEffect(() => {
    API("characters").then((res) => {
      setCharacters(res);
    });

    API("characters_models").then((res) => {
      setCharactersModels(res);
    });
  }, []);

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (characters && charactersModels) {
      let temp_inventory = [];
      let userCharas = characters.filter(
        (elem) => elem.user_id === parseInt(localStorage.getItem("userId"))
      );
      let charModel;
      userCharas.filter((char) => {
        charModel = charactersModels.filter(
          (charModel) => charModel.id === char.character_model_id
        );
        return char.character_model_id;
      });

      setUserChar(userCharas[0]);
      setUserCharModel(charModel[0]);

      for (let stuffName in userCharas[0].stuff.stuff) {
        for (let item in userCharas[0].stuff.stuff[stuffName]) {
          API("stuff/" + story_id + "/" + item).then((res) => {
            temp_inventory.push(`${res[0].item_name} - ${res[0].item_type}`);
            setInventory(temp_inventory);
          });
        }
        for (let item in userCharas[0].stuff.inventory[stuffName]) {
          API("stuff/" + story_id + "/" + item).then((res) => {
            temp_inventory.push(`${res[0].item_name} - ${res[0].item_type}`);
            setInventory(temp_inventory);
          });
        }
      }
    }
  }, [characters, charactersModels, story_id]);

  const dict_combat = [
    "killing",
    "slaughter",
    "fightin",
    "battlers",
    "attack",
    "defend",
    "defeat",
    "slainers",
    "injure",
    "wounded",
    "smashing",
    "crusher",
    "smiting",
    "sheathing",
  ];

  let text_levenshtein = section.content.action?.text || section.content.text;
  if (
    typeof text_levenshtein !== "undefined" &&
    section.content.action.type === "combat"
  ) {
    text_levenshtein = Levenshtein(text_levenshtein, dict_combat, 2, "#FF0000");
  }

  const [combatInfo, setCombatInfo] = useState("");

  useEffect(() => {
    setCombatInfo("");
  }, [sectionId]);

  return (
    <main id="section">
      <nav>
        {userChar && userCharModel && inventory && (
          <CharacterSheet
            type="small"
            name={userCharModel.name}
            stats={userChar.stats}
            inventory={inventory}
            img={CharImage}
            isClicked={clickedCharacter === `${userCharModel.name}`}
            onClick={() => handleCharacterClick(`${userCharModel.name}`)}
          />
        )}
      </nav>
      <section>
        <div>
          <StoryProgress section={sectionId} />
          <article>
            <p dangerouslySetInnerHTML={{ __html: text_levenshtein }}></p>
          </article>
        </div>
        <aside>
          {!combatInfo && (
            <Choices
              id={sectionId}
              setSectionId={setSectionId}
              setCombatInfo={setCombatInfo}
            />
          )}
          {combatInfo === "win" && (
            <Button
              type="story"
              size="small"
              text={section.content.action.win.text}
              onClick={() => {
                localStorage.setItem(
                  "sectionId",
                  section.content.action.win.goto
                );
                setSectionId(section.content.action.win.goto);
              }}
            />
          )}
          {combatInfo === "lose" && (
            <Button
              type="story"
              size="small"
              text={section.content.action.lose.text}
              onClick={() => {
                localStorage.setItem(
                  "sectionId",
                  section.content.action.lose.goto
                );
                setSectionId(section.content.action.lose.goto);
              }}
            />
          )}
          {combatInfo === "during" && (
            <div className="inProgress">
              <p>Fight still in progress !</p>
              <Choices
                id={sectionId}
                setSectionId={setSectionId}
                setCombatInfo={setCombatInfo}
              />
            </div>
          )}
        </aside>
      </section>
      <Loader loading={section.id === 0} />
    </main>
  );
};

export default SectionPage;
