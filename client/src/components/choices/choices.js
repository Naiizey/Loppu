import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import Dices from "../../components/dices/dices";
import { rollAllDices } from "../../components/dices/dices";
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
                    //console.log(stats);
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
            }
        } else {
            // if the key is "inventory"
            if (key === "stuff") {
                if (dico.stuff === "delete_all") {
                    API("characters/" + getCharaId() + "/inventory", "DELETE");
                }
                else {
                    //get the stuff object from the character wich is a jsonb object
                    API("/characters/" + getCharaId() + "/stuff").then((res) => {
                        // console.log(res);
                        let stuff = res[0].stuff.inventory;
                        console.log(stuff);
                        // for each key in the inventory dico
                        for (const index in dico[key]) {


                            let item = dico[key][index];
                            console.log(item);
                            let operator = item.operator;
                            if (operator !== undefined) {
                                let charaId = getCharaId();
                                let itemId = item.id_item;
                                switch (operator) {
                                    case "+":
                                        API("characters/" + charaId + "/inventory/" + itemId, "PUT").then((res) => {
                                            console.log(res);
                                        });
                                        break;
                                    case "-":
                                        API("characters/" + charaId + "/inventory/" + itemId, "DELETE").then((res) => {
                                            console.log(res);
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                }

            }
        }
    }
}

function setSectionIdLocalStorage(sectionId) {
    localStorage.setItem("sectionId", sectionId);
}

function gotoSection(sectionId, setSectionId) {
    console.log("gotoSection" + sectionId);
    setSectionIdLocalStorage(sectionId);
    localStorage.setItem("sectionId", sectionId);
    setSectionId(sectionId);
    let charaId = getCharaId();
    addPath(sectionId, charaId);
}

//function to go to an other section /!\ She needs to break the loop or the father
function gotoSectionButton(sectionId, setGotoSectionId, successText, failureText) {
    setSectionIdLocalStorage(sectionId);
    setGotoSectionId(sectionId);
    if (successText !== undefined) {
        localStorage.setItem("successText", successText);
    }
    if (failureText !== undefined) {
        localStorage.setItem("failureText", failureText);
    }
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
function diceResultConsequances(dico, setGotoSectionId) {
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
        gotoSectionButton(goto, setGotoSectionId, successText, failureText);
    }
}

// function to interpret a dice operation (must receive a "action" dico)
function interpretDiceResult(dico, diceValue, setGotoSectionId) {
    console.log("interpretDiceResult");
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
                        diceResultConsequances(element, setGotoSectionId);
                    }
                });
                break;

            case "equalsTo":
                let value = element.value;
                if (diceValue === value) {
                    diceResultConsequances(element, setGotoSectionId);
                }
                break;
            case "fromTo":
                let from = element.from;
                let to = element.to;
                if (diceValue >= from && diceValue <= to) {
                    diceResultConsequances(element, setGotoSectionId);
                }
                break;
            default:
                return false;
                break;
        }
    }
}

function checkIfDead() {
    let stats;
    let charaId = getCharaId();
    let dead = false;
    API("/characters/" + charaId).then((res) => {
        stats = res[0].stats;
        if (stats.resistance <= 0) {
            deadButton();
            dead = true;
        }
    });
    return dead;
}

// function to handle the require section (need to have a "require" dico in parameters) 
function interpretRequire(dico, setGotoSectionId, choiceNumber, gotoId) {
    return new Promise((resolve, reject) => {
        if (dico.action !== undefined) {
            switch (dico.type) {
                case "dice":
                    launchDices(dico.numberOfDice).then((res) => {
                        interpretDiceResult(dico, res, setGotoSectionId);
                        resolve();
                    });
                    break;
                case "combat":
                    // TODO : integrate the fight
                    break;
                case "story":
                    interpretStory(dico, gotoId, choiceNumber, setGotoSectionId);
                    resolve();
                    break;
                default:
                    reject(new Error("unknown require type"));
                    break;
            }
        }
        else if (dico.type === "items") {
            if (dico.item !== undefined) {
                let item = dico.item;
                let id_item = item.id_item;
                let quantity = item.quantity;
                let charaId = getCharaId();
                // get character stuff
                API("/characters/" + charaId + "/stuff").then((res) => {
                    let stuff = res[0].stuff;
                    let inventory = res[0].inventory;
                    // [{"5": "weapon"}, ...]
                    inventory.forEach(element => {
                        if (element[id_item] !== undefined) {
                            resolve(true);
                        }
                    });
                    resolve(false);
                });
            }
            else {
                reject(new Error("Missing item in require dico"))
            }
        }
        else if (dico.type === "stats") {
            if (dico.stats !== undefined) {
                let stats = dico.stats;
                let charaId = getCharaId();
                let operator = stats.operator;
                let stat = stats.stat;
                let value = stats.value;
                checkStatsPrerequesites(stat, operator, value).then(result => {
                    resolve(result);
                });
            }
        }
        else {
            reject(new Error("unknown require type"))
        }
    });
}

// function to interpret a story (must receive a "story" dico)
function interpretStory(story, gotoID, setSectionId, choiceNumber, setGotoSectionId) {
    console.log("story");
    // console.log(story);
    if (story.alreadyVisited !== undefined && parseInt(story.alreadyVisited > 0)
        // TODO: check if already visited
    ) {
        let alreadyVisited = parseInt(story.alreadyVisited);
        gotoSection(alreadyVisited, setSectionId);
    } else {
        let choices = story.choices;



        if (choices !== undefined && choices.length > 0) {
            let choice = choices[choiceNumber];
            if (choice.goto !== undefined) {
                if (choice.goto === gotoID && choice.require === undefined) {
                    if (choice.require === undefined) {
                        if (choice.impact !== undefined) {
                            interpretImpact(choice.impact);
                        }
                    }
                    else {
                        // wait for the interpretation of the require
                        interpretRequire(choice.require, setGotoSectionId, choiceNumber, gotoID).then((result) => {
                            if (result) {
                                if (choice.impact !== undefined) {
                                    interpretImpact(choice.impact);
                                }
                                gotoSection(choice.goto, setSectionId);
                            }
                        });
                    }
                    gotoSection(choice.goto, setSectionId);
                }

            }
            else {
                if (choice.require === undefined) {
                    if (choice.impact !== undefined) {
                        interpretImpact(choice.impact);
                    }
                }
                else {
                    // wait for the interpretation of the require
                    interpretRequire(choice.require, setGotoSectionId, choiceNumber).then((result) => {
                        if (result) {
                            if (choice.impact !== undefined) {
                                interpretImpact(choice.impact);
                            }
                        }
                    });
                }            
            }
        }
        else {
            throw new Error("No choices in the story dico");
        }
        // }
    }
}


function deadButton() {
    let sectionId = localStorage.getItem("sectionId");
    if (sectionId !== null && sectionId !== undefined && sectionId !== 13) {
        if (localStorage.getItem("dead") === null) {
            localStorage.setItem("dead", 1);
        }
    }

}

// const version of the fnction launchDices bcs she need to be waited before the return
const launchDices = async (numberOfDice) => {
    console.log("launch " + numberOfDice + " Dices");
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

function interpretAction(gotoId, choiceNumber, setSectionId, setGotoSectionId) {
    if (!checkIfDead()) {
        let storyID = localStorage.getItem("storyId");
        let currentSectionId = localStorage.getItem("sectionId");
        let section = {};
        API("sections/" + storyID + "/" + currentSectionId).then((res) => {
            section = res[0];
            if (section.content.action.type === "story") {
                interpretStory(section.content.action, gotoId, setSectionId, choiceNumber, setGotoSectionId);
            } else if (section.content.action.type === "combat") {
                console.log("combat");
            }
        });
    }

}

function getChoices(id) {
    console.log("getChoices");
    console.log(id);
    let story_id = localStorage.getItem("storyId");
    console.log("story_id");
    console.log(story_id);
    return new Promise ((resolve, reject) => {
        API("choices/" + story_id + "/" + id).then((res) => {
            resolve(res);
        }).catch((error) => {
            console.error('Une erreur est survenue:', error);
            resolve([]);
        });
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
    const [dead, setDead] = useState(0);
    const [gotoSectionId, setGotoSectionId] = useState(0);
    const handleButtonClick = (item, i) => {
        interpretAction(
            item.id_section_to,
            i,
            setSectionId,
            setGotoSectionId
        );
        // wait that "numberOfDices" of the localStorage is set
        setTimeout(() => {
            let numberOfDices = localStorage.getItem("numberOfDices");
            if (numberOfDices !== null || numberOfDices !== undefined) {
                setDiceValue(numberOfDices);
                localStorage.removeItem("numberOfDices");
            }

            let dead = localStorage.getItem("dead");
            if (dead !== null || dead !== undefined) {
                setDead(dead);
                localStorage.removeItem("dead");
            }
        }, 100);
    };





    useEffect(() => {
        getChoices(id).then((res) => {
            console.log(res);
            setChoices(res);
        });
    }, [story_id, id]);

    return (
        <div className="container-choices">
            <Dices nbDices={diceValue} />
            {dead == 1 ? (
                <Button
                    size={"small"}
                    text={"Next"}
                    type={"story"}
                    onClick={() => {
                        gotoSection(13, setSectionId);
                    }}
                />
            ) : gotoSectionId !== 0 ? (
                <Button
                    size={"small"}
                    text={localStorage.getItem("successText") || localStorage.getItem("failureText") || "Continuez"}
                    type={"story"}
                    onClick={() => {
                        gotoSection(gotoSectionId, setSectionId);
                    }}
                />
            ) : (
                choices &&
                choices.map((item, i) => {
                    return (
                        <Button
                            key={i}
                            size={"small"}
                            text={item.content}
                            type={"story"}
                            onClick={() => {
                                //   setChoices(item.id_section_to);
                                //   setSectionId(item.id_section_to);
                                handleButtonClick(item, i);
                                //addPath(item.id_section_to, 1);
                            }}
                        />
                    );
                })
            )}
        </div>
    );
};

export default Choices;
