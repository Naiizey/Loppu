import "./story.css";
import { useState } from "react";
import Choices from "../../components/choices/choices";
import API from "../../utils/API";
import { useEffect } from "react";
import CharacterSheet from '../../components/characterSheet/characterSheet';

const SectionPage = () => {
    const [clickedCharacter, setClickedCharacter] = useState(null);

    const handleCharacterClick = (characterName) => {
        setClickedCharacter(prev => prev === characterName ? null : characterName);
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
              <hr />
              <hr />
            </ol>
            <hr />
            <hr />
          </div>
          <div>
            <h2>{title}</h2>
            <h3>section {section.id} - village</h3>
          </div>
        </div>
        <article>
          <p>{section.content.action.text}</p>
        </article>
      </section>
      <Choices id={sectionId} setSectionId={setSectionId} />
    </main>
  );
};

export default SectionPage;
