import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import Dices from "../../components/dices/dices";
import {rollAllDices} from "../../components/dices/dices";
import characterSheet from "../characterSheet/characterSheet";

var diceResults = [];
// function to handle the fight
function autoFight() { }

function getCharaId() {
    if (localStorage.getItem("charaId") === null) {
        ;
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

    API("characters/" + getCharaId() + "/stats",
        "PUT",
        actualDicoStat,
    );
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
                    stats = res[0].stats;
                    console.log(stats);
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
                });

                // for each key in the stats dico

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
        <div class="container-choices">
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
const checkStatsPrerequesites = (stat, operator, value) => {
    let stats;
    let charaId = getCharaId();
    return API("/characters/" + charaId).then((res) => {
        stats = res[0].stats;
        // The operator is a string containing the operator to use
        // eg : "<", ">", "<=", ">=", "=="
        switch (operator) {
            case "<":
                return stats[stat] < value;
            case ">":
                return stats[stat] > value;
            case "<=":
                return stats[stat] <= value;
            case ">=":
                return stats[stat] >= value;
            case "==":
                return stats[stat] === value;
            default:
                return false;
        }
    });
};




// function to execute the consequences of a dice result (must receive a "diceResult" dico)
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
    let diceResultList = dico.diceResult;
    for (let index = 0; index < diceResultList.length; index++) {
        let element = diceResultList[index];
        let checkType = element.checkType;
        switch (checkType) {
            case "comparison":
                let stat = element.stat;
                let operator = element.operator;
                checkStatsPrerequesites(stat, operator, diceValue).then(result => {
                    console.log("result: " + result);
                    if (result) {
                        diceResultConsequances(element);
                    }
                });
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



function interpretStory(story, gotoID, setSectionId) {
    // console.log("story");
    // console.log(story);
    if (
        story.alreadyVisited !== undefined &&
        parseInt(story.alreadyVisited > 0)
        // TODO: check if already visited
    ) {
        let alreadyVisited = parseInt(story.alreadyVisited);
        setSectionId(alreadyVisited);
    } else {
        let choices = story.choices;
        if (choices !== undefined && choices.length > 0) {
            for (let i = 0; i < choices.length; i++) {
                let choice = choices[i];
                //console.log("choice:" + JSON.stringify(choice));
                if (choice.goto !== undefined) {
                    if (choice.goto === gotoID) {
                        setSectionId(choice.goto);
                    }
                } else {
                    let newChoice = choice.require.action;
                    switch (newChoice.type) {
                        case "dice":
                            //launch the dices and wait for the result
                            launchDices(newChoice.numberOfDice).then((res) => {
                                interpretDiceResult(newChoice, res);
                            });
                            break;
                        case "combat":
                        //fight(choice);
                        case "story":
                            interpretStory(newChoice.action, gotoID);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
}



// const version of the fnction launchDices bcs she need to be waited before the return
const launchDices = async (numberOfDice) => {
    console.log("launch "+numberOfDice+" Dices" );
    localStorage.setItem("numberOfDices", numberOfDice);
    //wait 100ms to be sure that the value is set   
    await new Promise(resolve => setTimeout(resolve, 100));
    const res = await rollAllDices();
    return res;
}

function addPath(id_sections, id_character) {
    let path = {
        id_character,
        id_sections,
    };

    API("paths", "POST", path);
}

function interpretAction(gotoId, choiceNumber, setSectionId) {
    let storyID = localStorage.getItem("storyId");
    let currentSectionId = localStorage.getItem("sectionId");
    let section = {};
    API("sections/" + storyID + "/" + currentSectionId).then((res) => {
        section = res[0];
        if (section.content.action.type === "story") {
            interpretStory(section.content.action, gotoId, setSectionId);
        } else if (section.content.action.type === "combat") {
            console.log("combat");
        }
    });
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
    const [diceValue, setDiceValue] = useState(0); 
    const handleButtonClick = (item) => {
        interpretAction(
            item.id_section_to,
            0
        );
        // wait that "numberOfDices" of the localStorage is set
        setTimeout(() => {
            let value = localStorage.getItem("numberOfDices");
            if (value !== null || value !== undefined) {
                setDiceValue(value);
            }
        }, 100);
    };

    useEffect(() => {
        API("choices/" + story_id + "/" + id).then((res) => {
            setChoices(res);
        });
    }, [story_id, id]);

    return (
        <div className="container-choices">
            <Dices nbDices={diceValue} />
            {choices &&
                choices.map((item, i) => {
                    return (
                        <Button
                            key={i}
                            size={"small"}
                            text={item.content}
                            onClick={() => {
                                //   setChoices(item.id_section_to);
                                //   setSectionId(item.id_section_to);
                                handleButtonClick(item);
                                addPath(item.id_section_to, 1);
                            }}
                        />
                    );
                })}
        </div>
    );
};

export default Choices;
