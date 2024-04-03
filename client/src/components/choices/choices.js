import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";

const Choices = ({ id, setSectionId }) => {
  const [choices, setChoices] = useState([
    {
      content: "",
      id_section_from: 0,
      id_section_to: 0,
      id_story: 0,
      impact: {},
      lose: false,
      parent_key: "",
      victory: false,
    },
  ]);
  const story_id = localStorage.getItem("storyId");

  useEffect(() => {
    API("choices/" + story_id + "/" + id).then((res) => {
      setChoices(res);
    });
  }, [story_id, id]);

  return (
    <div>
      {choices.map((item, i) => {
        return (
          <Button
            key={i}
            size={"small"}
            type={"info"}
            text={item.content}
            onClick={() => {
              setChoices(item.id_section_to);
              setSectionId(item.id_section_to);
            }}
          />
        );
      })}
    </div>
  );
};

export default Choices;
