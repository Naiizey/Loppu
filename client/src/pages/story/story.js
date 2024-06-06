import "./story.css";
import { useState, useEffect } from "react";
import Choices from "../../components/choices/choices";
import API from "../../utils/API";
import CharacterSheet from "../../components/characterSheet/characterSheet";
import Loader from "../../components/loader/loader";
import StoryProgress from "../../components/storyProgress/storyProgress";
import CharImage from "../../assets/images/giant.jpg";
import Button from "../../components/button/button";
import Levenshtein from "../../levenshtein";
import Image from "../../assets/images/storiesDisplay.jpg";

/**
 * Function to check if the section has already been visited
 * @param {object} res The response from the API (section)
 * @param {int} story_id The id of the story
 * @returns A promise with the response from the API (section)
 */
async function checkAlreadyVisited(res, story_id) {
  return new Promise((resolve, reject) => {
    if (res.content.action !== undefined) {
      if (res.content.action.alreadyVisited !== undefined) {
        let caraId = parseInt(localStorage.getItem("charaId"));
        API(
          "paths/" +
            caraId +
            "/" +
            res.content.action.alreadyVisited
        ).then((pathRes) => {
          if (pathRes.length === 0) {
            resolve(res);
          }
          else
          {
            let id = pathRes[0];
            if (id !== undefined && id !== null)
            {
              console.log("Already visited section " + id + " ! -> must go to section " + res.content.action.alreadyVisited);
              localStorage.setItem("sectionId", id);
              API("sections/" + story_id + "/" + id).then((secRes) => {
                resolve(secRes);
              });
            } else {
              resolve(res);
            }
          }
        });
      } else {
        resolve(res);
      }
    }
  });
}

const SectionPage = () => {
  const [clickedCharacter, setClickedCharacter] = useState(null);

  const handleCharacterClick = (characterName) => {
    setClickedCharacter((prev) =>
      prev === characterName ? null : characterName
    );
  };

  const [storyTitle, setStoryTitle] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");

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

  var story_id = localStorage.getItem("storyId");
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
    let tmpSectionId = localStorage.getItem("sectionId");
    if (typeof tmpSectionId !== "number") {
      tmpSectionId = parseInt(tmpSectionId);
    }
    setSectionId(tmpSectionId);
  }, [section]);

  useEffect(() => {
    API("sections/" + story_id + "/" + sectionId).then((res) => {
      res = res[0];
      let intSectionId = parseInt(sectionId);
      if (intSectionId !== 50)
      {
        checkAlreadyVisited(res, story_id).then((res) => {
          setSection(res);
        });
      }
      else{
        setSection(res);
      }

    });
    
  }, [sectionId]);

  useEffect(() => {
    API("stories/" + story_id).then((res) => {
      setStoryTitle(res[0].title);
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
      }
      for (let stuffName in userCharas[0].stuff.inventory) {
        for (let item in userCharas[0].stuff.inventory[stuffName]) {
          API("stuff/" + story_id + "/" + item).then((res) => {
            temp_inventory.push(`${res[0].item_name} - ${res[0].item_type}`);
            setInventory(temp_inventory);
          });
        }
      }
    }
  }, [characters, charactersModels, story_id]);

  useEffect(() => {
    if(userChar){
      let temp_inventory = []
      for (let stuffName in userChar.stuff.stuff) {
        for (let item in userChar.stuff.stuff[stuffName]) {
          API("stuff/" + story_id + "/" + item).then((res) => {
            temp_inventory.push(`${res[0].item_name} - ${res[0].item_type}`);
            setInventory(temp_inventory);
          });
        }
      }
      for (let stuffName in userChar.stuff.inventory) {
        for (let item in userChar.stuff.inventory[stuffName]) {
          API("stuff/" + story_id + "/" + item).then((res) => {
            temp_inventory.push(`${res[0].item_name} - ${res[0].item_type}`);
            setInventory(temp_inventory);
          });
        }
      }
    }
  }, [userChar])

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
    section.content.action !== undefined &&
    section.content.action.type === "combat"
    
  ) {
    text_levenshtein = Levenshtein(text_levenshtein, dict_combat, 2, "#FF0000");
  }
  const [combatInfo, setCombatInfo] = useState("");

  useEffect(() => {
    setCombatInfo("");
  }, [sectionId]);

  const [currEnemyHealth, setCurrEnemyHealth] = useState(null);
  const [maxEnemyHealth, setMaxEnemyHealth] = useState(null);
  return (
    <main id="section">
      <nav>
        {userChar && userCharModel && inventory && (
          <CharacterSheet
            type="small"
            name={userCharModel.name}
            character={userChar}
            inventory={inventory}
            img={CharImage}
            isClicked={clickedCharacter === `${userCharModel.name}`}
            onClick={() => handleCharacterClick(`${userCharModel.name}`)}
          />
        )}
      </nav>
      <section>
        <div>
          <StoryProgress storyId={story_id} storyTitle={storyTitle} sectionId={sectionId} sectionTitle={sectionTitle}/>
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
              currEnemyHealth={currEnemyHealth}
              setCurrEnemyHealth={setCurrEnemyHealth}
              maxEnemyHealth={maxEnemyHealth}
              setMaxEnemyHealth={setMaxEnemyHealth}
              setUserChar={setUserChar}
              userChar={userChar}
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
              targetIdSection = {section.content.action.win.goto}
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
              targetIdSection = {section.content.action.lose.goto}
            />
          )}
          {combatInfo === "during" && (
            <div className="inProgress">
              <p>{section.content.action.enemy.name}'s health :</p>
              <div className="hpBar">
                {
                  Array.from({length: maxEnemyHealth}).map((hp, index) => (
                    <div ref={hp} className={`${index + 1 <= currEnemyHealth ? 'hitpoint currHealth' : 'hitpoint'}`}></div>
                  ))
                }
              </div>
              <Choices
                id={sectionId}
                setSectionId={setSectionId}
                setCombatInfo={setCombatInfo}
                currEnemyHealth={currEnemyHealth}
                setCurrEnemyHealth={setCurrEnemyHealth}
                maxEnemyHealth={maxEnemyHealth}
                setMaxEnemyHealth={setMaxEnemyHealth}
                setUserChar={setUserChar}
                userChar={userChar}
              />
            </div>
          )}
        </aside>
      </section>
      <div className="backgroundImage">
        <img src={Image} alt="background" />
      </div>
      <Loader loading={section.id === 0} />
    </main>
  );
};

export default SectionPage;
