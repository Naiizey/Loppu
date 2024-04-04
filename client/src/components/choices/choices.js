import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";

// function to handle the fight
function autoFight() {}

function getCharaId() {
    if (localStorage.getItem("charaId") === undefined) {
        localStorage.setItem("charaId", 1);
        return 1;
    } else {
        return localStorage.getItem("charaId");
    }
}

// upatde the stats of the character
function editStat(operator, value, stat, actualDicoStat) {
    switch (operator) {
        case "+":
            actualDicoStat[stat] += value;
            break;
        case "-":
            actualDicoStat[stat] -= value;
            break;
        default:
            break;
    }

    let character = {};
    API("characters/" + getCharaId()).then((res) => {
        character = res[0];
        console.log(res);
    });

    // change the stats
    character.stats = actualDicoStat;

    // PUT the character
    API("/characters/" + getCharaId() + "/stats", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(character.stats),
    }).then((res) => {
        console.log(res);
    });
}

//function to interpret an impact (must receive an "impact" dico)
function interpretImpact(dico) {
    let stats = {};

    // for each key in the dico
    for (const key in dico) {
        // if the key is "stats"
        if (key === "stats") {
            for (const typeStat in dico[key]) {
                //get the current stats

                API("/characters/" + getCharaId()).then((res) => {
                    stats = res[0];
                });

                // for each key in the stats dico
                for (const stat in stats) {
                    // if the stat is typeStat
                    if (stat === typeStat) {
                        editStat(
                            dico[key][typeStat].operator,
                            dico[key][typeStat].value,
                            stat,
                            stats
                        );
                    }
                }
            }
        } else {
            // if the key is "inventory"
            if (key === "stuff") {
                // for each key in the inventory dico
                for (const item in dico[key]) {
                    // if the key is "add"
                    if (item === "add") {
                        // add the item to the inventory
                        // API to update the inventory
                    }
                    // if the key is "remove"
                    if (item === "remove") {
                        // remove the item from the inventory
                        // API to update the inventory
                    }
                }
            }
        }
    }
}

function setSectionIdLocalStorage(sectionId) {
    localStorage.setItem("sectionId", sectionId);
}

//function to go to an other section /!\ She needs to break the loop or the father
function gotoTo(sectionId, successText = null, failureText = null) {
    return (
        <div>
            <p>
                {successText !== null ? successText : ""}
                {failureText !== null ? failureText : ""}
            </p>
            <Button
                key={sectionId}
                size={"small"}
                type={"info"}
                text={"Suivant"}
                onClick={() => {
                    setSectionIdLocalStorage(sectionId);
                }}
            />
        </div>
    );
}

// function to check if the stats verify a certain value
function checkStatsPrerequesites(stat, operator, value) {
    let isfilled = false;
    let stats;

    API("/characters/" + getCharaId()).then((res) => {
        stats = res[0];
    });

    // The operator is a string containing the operator to use
    // eg : "<", ">", "<=", ">=", "=="
    switch (operator) {
        case "<":
            if (stats[stat] < value) {
                isfilled = true;
            }
            break;
        case ">":
            if (stats[stat] > value) {
                isfilled = true;
            }
            break;
        case "<=":
            if (stats[stat] <= value) {
                isfilled = true;
            }
            break;
        case ">=":
            if (stats[stat] >= value) {
                isfilled = true;
            }
            break;
        case "==":
            if (stats[stat] === value) {
                isfilled = true;
            }
            break;
        default:
            break;
    }

    return isfilled;
}

// function to execute the consequances of a dice result (must receive a "diceResult" dico)
function diceResultConsequances(dico) {
    let successText;
    if (dico.successText !== undefined) {
        successText = dico.successText;
    }
    let failureText;
    if (dico.failureText !== undefined) {
        failureText = dico.failureText;
    }
    if (dico.impact !== undefined) {
        let impact = dico.impact;
        interpretImpact(impact);
    }
    if (dico.goto !== undefined) {
        let goto = dico.goto;
        gotoTo(goto, successText, failureText);
    }
}

// function to interpret a dice operation (must receive a "action" dico)
function interpretDiceResult(dico, diceValue) {
    for (let index = 0; index < dico.diceResult.length; index++) {
        const element = dico[index];
        let checkType = element.checkType;
        switch (checkType) {
            case "comparison":
                let stat = element.stat;
                let operator = element.operator;
                if (checkStatsPrerequesites(stat, operator, diceValue)) {
                    diceResultConsequances(element);
                }
                break;
            case "equalsTo":
                let value = element.value;
                if (diceValue === value) {
                    diceResultConsequances(element);
                }
                break;
            case "fromTo":
                let from = element.from;
                let to = element.to;
                if (diceValue >= from && diceValue <= to) {
                    diceResultConsequances(element);
                }
                break;
            default:
                return false;
                break;
        }
    }
}

function detectDice(section, choiceNumber) {
    let dico = {};
    let content = section.content.action;
    if (content.choices !== undefined && content.choices.length > 0) {
        let choice = content.choices[choiceNumber];
        if (choice.type === "dice") {
            if (choice.numberOfDice !== undefined && choice.numberOfDice > 0) {
                dico["numberOfDice"] = choice.numberOfDice;
                dico["diceResult"] = choice.diceResult;
                if (choice.lose !== undefined) {
                    dico["lose"] = choice.lose;
                }
                if (choice.win !== undefined) {
                    dico["win"] = choice.win;
                }
                return true, dico;
            } else {
                return false, "numberOfDice undefined";
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function interpretStory(sectionId, choiceNumber) {}

function interpretAction(sectionId, choiceNumber) {
    console.log("sectionId:" + sectionId);
    let storyID = localStorage.getItem("storyId");
    let section = {};
    API("sections/" + storyID + "/" + sectionId).then((res) => {
        section = res[0];
    });

    if (section.type === "story") {
        console.log("story");
    } else if (section.type === "combat") {
        console.log("combat");
    }
}

const Choices = ({ id, setSectionId, section }) => {
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

  console.log("choices:" + JSON.stringify(choices));
  return (
    <div>
      { choices &&
      choices.map((item, i) => {
        return (
          <Button
            key={i}
            size={"small"}
            type={"info"}
            text={item.content}
            onClick={() => {
              setChoices(item.id_section_to);
              setSectionId(item.id_section_to);
              interpretAction(item.id_section_to, 0);
            }}
          />
        );
      })}
    </div>
  );
};

export default Choices;
