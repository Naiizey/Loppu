import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import Dices from "../../components/dices/dices";
import { rollAllDices } from "../../components/dices/dices";

/**
 * Function to get the id of the character from the local storage
 * @returns the id of the character
 */
function getCharaId() {
  if (localStorage.getItem("charaId") === null) {
    localStorage.setItem("charaId", 1);
    return 1;
  } else {
    return localStorage.getItem("charaId");
  }
}

/**
 * Edit the stat of the character from the dico and  update them in the database
 * @param { String } operator The oprator to use
 * @param { Integer } value The value to add or substract
 * @param { Object } stat The stat to edit
 * @param { Object } actualDicoStat The dictionary of the stats
 * @param { Object } userChar The character informations
 * @param { Object } setUserChar The function to set the character informations
 */
function editStat(operator, value, stat, actualDicoStat, userChar, setUserChar) {
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

  const characterSheetClasslist = document.querySelector('.characterSheetSmall').classList;

  characterSheetClasslist.add('shake');

  setTimeout(() => {
    characterSheetClasslist.remove('shake');
  }, 1000)

  API("characters/" + getCharaId() + "/stats", "PUT", actualDicoStat);

  const tmpChar = userChar;
  tmpChar.stats = actualDicoStat;

  setUserChar(tmpChar);
}

/**
 * Function to impact the stats of the character based on the story impact dico
 * @param { * } key The key of the dico
 * @param { Object } dico The dico of the stats
 * @param { Object } stats The stats of the character
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 *
 * @returns The dico of the stats.
 */
function impactStats(key, dico, stats, userChar, setUserChar) {
  API("/characters/" + getCharaId()).then((res) => {
    stats = res[0].stats;
    for (const typeStat in dico[key]) {
      for (const stat in stats) {
        if (stat === typeStat) {
          editStat(
            dico[key][typeStat].operator,
            dico[key][typeStat].value,
            stat,
            stats,
            userChar,
            setUserChar
          );
        }
      }
    }
  });
  return stats;
}

/**
 * Function to edit the inventory of the character based on the story impact dico
 * @param {*} key  The key of the dico
 * @param {*} dico The impact dico
 */
function impactInventory(key, dico) {
  for (const index in dico[key]) {
    let item = dico[key][index];
    let operator = item.operator;
    if (operator !== undefined) {
      let charaId = getCharaId();
      let itemId = item.id_item;
      switch (operator) {
        case "+":
          API(
            "characters/" + charaId + "/inventory/" + itemId,
            "PUT"
          ).then(() => {});
          break;
        case "-":
          API(
            "characters/" + charaId + "/inventory/" + itemId,
            "DELETE"
          ).then(() => {});
          break;
        default:
          break;
      }
    }
  }
}

/**
 * function to interpret an impact
 * @param { Object } dico the impact dico
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretImpact(dico, userChar, setUserChar) {
  let stats = {};
  for (const key in dico) {
    if (key === "stats") {
        impactStats(key, dico, stats, userChar, setUserChar);
    } else {
      if (key === "stuff") {
        if (dico.stuff === "delete_all") {
          API("characters/" + getCharaId() + "/inventory", "DELETE");
        } else {
          impactInventory(key, dico);
        }
      }
    }
  }
}

/**
 * Function to set the section id in the local storage
 * @param {*} sectionId The id of the section
 */
function setSectionIdLocalStorage(sectionId) {
  localStorage.setItem("sectionId", sectionId);
}

/**
 * Function to go to a section
 * @param {*} sectionId  The id of the section
 * @param {*} setSectionId The function to set the section id
 * @param {*} setDiceValue The function to set the dice value
 */
function gotoSection(sectionId, setSectionId, setDiceValue) {
  setDiceValue(0);
  setSectionIdLocalStorage(sectionId);
  localStorage.setItem("sectionId", sectionId);
  setSectionId(sectionId);
  let charaId = getCharaId();
  addPath(sectionId, charaId);
}

//function to go to an other section /!\ She needs to break the loop or the father
function gotoSectionButton(sectionId, setGotoSectionId, successText, failureText)
{
  console.log("gotoSectionButton");
  setSectionIdLocalStorage(sectionId);
  setGotoSectionId(sectionId);
  if (successText !== undefined) {
    localStorage.setItem("successText", successText);
  }
  if (failureText !== undefined) {
    localStorage.setItem("failureText", failureText);
  }
}

/**
 * Function to check the prerequesites of the stats
 * @param {*} stat The stat name to check
 * @param {*} operator The operator to use
 * @param {*} value The value to check
 * @returns
 */
const checkStatsPrerequesites = (stat, operator, value) => {
  let stats;
  let charaId = getCharaId();
  return API("/characters/" + charaId).then((res) => {
    stats = res[0].stats;
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

/**
 * Function to interpret the impact of the dice result
 * @param { Object } dico The dico of the dice result consequences
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set character informations
 */
function diceResultConsequances(dico, setGotoSectionId, userChar, setUserChar) {
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
    interpretImpact(impact, setUserChar, userChar);
  }
  if (dico.goto !== undefined) {
    let goto = dico.goto;
    gotoSectionButton(goto, setGotoSectionId, successText, failureText);
  }
}

/**
 * Function to interpret the dice result
 * @param { Object } dico The action dictionary
 * @param { Integer } diceValue The value of the dice
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 *
 * @returns a boolean
 */
function interpretDiceResult(dico, diceValue, setGotoSectionId, userChar, setUserChar) {
  let diceResultList = dico.diceResult;
  for (let index = 0; index < diceResultList.length; index++) {
    let element = diceResultList[index];
    let checkType = element.checkType;
    switch (checkType) {
      case "comparison":
        let stat = element.stat;
        let operator = element.operator;
        checkStatsPrerequesites(stat, operator, diceValue).then((result) => {
          if (result) {
            diceResultConsequances(element, setGotoSectionId, setUserChar, userChar);
          }
        });
        break;
      case "equalsTo":
        let value = element.value;
        if (diceValue === value) {
          diceResultConsequances(element, setGotoSectionId, setUserChar, userChar);
        }
        break;
      case "fromTo":
        let from = element.from;
        let to = element.to;
        if (diceValue >= from && diceValue <= to) {
          diceResultConsequances(element, setGotoSectionId, setUserChar, userChar);
        }
        break;
      default:
        return false;
    }
  }
}

/**
 * Function to check if the character is dead
 * @returns a boolean
 */
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

/**
 * The function to interpret the require section if the character is not dead
 * @param { Object } dico The whole section dico
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function notDeadRequireProcess(dico, setGotoSectionId, userChar, setUserChar)
{
  if (!checkIfDead()) {
    if (dico.action.win.goto !== undefined) {
      let text = null;
      if (dico.action.win.text !== undefined) {
        text = dico.action.win.text;
      }
      if (dico.action.win.impact !== undefined) {
        interpretImpact(dico.action.win.impact, userChar, setUserChar);
      }
      gotoSectionButton(
        dico.action.win.goto,
        setGotoSectionId,
        text
      );
    } else {
      if (dico.action.win.impact !== undefined) {
        interpretImpact(dico.action.win.impact, userChar, setUserChar);
      }
    }
  }
}

/**
 * The function to interpret the require section if the character is dead
 * @param { Object } dico The whole section dico
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function deadRequireProcess(dico, setGotoSectionId, userChar, setUserChar) {
  if (checkIfDead()) {
    if (dico.action.lose.goto !== undefined) {
      let text = null;
      if (dico.action.lose.text !== undefined) {
        text = dico.action.lose.text;
      }
      if (dico.action.lose.impact !== undefined) {
        interpretImpact(dico.action.lose.impact, userChar, setUserChar);
      }
      gotoSectionButton(
        dico.action.lose.goto,
        setGotoSectionId,
        null,
        text
      );
    } else {
      if (dico.action.lose.impact !== undefined) {
        interpretImpact(dico.action.lose.impact, userChar, setUserChar);
      }
    }
  }
}

/**
 * Function process the undefined action section
 * @param { Object } dico The whole section dico
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Integer } choiceNumber The number of the choice
 * @param { Integer } gotoId The id of the goto section
 * @param { Function } setSectionId The function to set the section id
 * @param { Function } setDiceValue The function to set the dice value
 * @param { * } resolve The resolve function of the promise
 * @param { * } reject The reject function of the promise
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function undefinedActionProcess(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, resolve, reject, userChar, setUserChar)
{
  switch (dico.action.type) {
    case "dice":
      launchDices(dico.action.numberOfDice, setDiceValue).then((res) => {
        interpretDiceResult(dico.action, res, setGotoSectionId, userChar, setUserChar);
        if (dico.action.win !== undefined) {
          notDeadRequireProcess(dico, setGotoSectionId, userChar, setUserChar);
        }
        if (dico.action.lose !== undefined) {
          deadRequireProcess(dico, setGotoSectionId, userChar, setUserChar);
        }
        resolve();
      });
      break;
    case "story":
      interpretStory(dico, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar);
      resolve();
      break;
    default:
      reject(new Error("unknown require type"));
      break;
  }
}

/**
 * Function to process the item action
 * @param { Object } dico The whole section dico
 * @param { * } resolve The resolve function of the promise
 * @param { * } reject The reject function of the promise
 */
function itemActionProcess(dico, resolve, reject) {
  if (dico.item !== undefined) {
    let item = dico.item;
    let id_item = item.id_item;
    let charaId = getCharaId();
    API("/characters/" + charaId + "/stuff").then((res) => {
      let inventory = res[0].inventory;
      inventory.forEach((element) => {
        if (element[id_item] !== undefined) {
          resolve(true);
        }
      });
      resolve(false);
    });
  } else {
    reject(new Error("Missing item in require dico"));
  }
}

/**
 * Function to process the stat action
 * @param {*} dico The whole section dico
 * @param {*} resolve The resolve function of the promise
 */
function statActionProcess(dico, resolve) {
  if (dico.stats !== undefined) {
    let stats = dico.stats;
    let operator = stats.operator;
    let stat = stats.stat;
    let value = stats.value;
    checkStatsPrerequesites(stat, operator, value).then((result) => {
      resolve(result);
    });
  }
}

/**
 * Function to interpret the require section
 * @param { Object } dico The whole section dico
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Integer } choiceNumber The number of the choice
 * @param { Integer } gotoId The id of the goto section
 * @param { Function } setSectionId The function to set the section id
 * @param { Function } setDiceValue The function to set the dice value
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 * @returns A promise
 */
function interpretRequireStory(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, userChar, setUserChar)
{
  return new Promise((resolve, reject) => {
    if (dico.action !== undefined) {
      undefinedActionProcess(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, resolve, reject, userChar, setUserChar);
    } else if (dico.type === "items") {
      itemActionProcess(dico, resolve, reject);
    } else if (dico.type === "stats") {
      statActionProcess(dico, resolve);
    } else {
      reject(new Error("unknown require type"));
    }
  });
}

// function to interpret a story (must receive a "story" dico)
/**
 * Function to interpret a story
 * @param { Object } story The story dico
 * @param { Integer } gotoID The id of the goto section
 * @param { Function } setSectionId The function to set the section id
 * @param { Integer } choiceNumber The number of the choice
 * @param { Function } setGotoSectionId The function to set the goto section id
 * @param { Function } setDiceValue The function to set the dice value
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretStory(story, gotoID, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar)
{
  let choices = story.choices;
  if (choices !== undefined && choices.length > 0) {
    let choice = choices[choiceNumber];
    if (choice.goto !== undefined) {
      if (choice.goto === gotoID && choice.require === undefined) {
        if (choice.require === undefined) {
          if (choice.impact !== undefined) {
            interpretImpact(choice.impact, setUserChar, userChar);
          }
        } else {
          interpretRequireStory(choice.require, setGotoSectionId, choiceNumber, gotoID, setSectionId, setDiceValue, userChar, setUserChar).then((result) => {
            if (result) {
              if (choice.impact !== undefined) {
                interpretImpact(choice.impact, setUserChar, userChar);
              }
              gotoSection(choice.goto, setSectionId, setDiceValue);
            }
          });
        }
        gotoSection(choice.goto, setSectionId, setDiceValue);
      }
    } else {
      if (choice.require === undefined) {
        if (choice.impact !== undefined) {
          interpretImpact(choice.impact, setUserChar, userChar);
        }
      } else {
        interpretRequireStory(choice.require, setGotoSectionId, choiceNumber, gotoID, setSectionId, setDiceValue, userChar, setUserChar).then((result) => {
          if (result) {
            if (choice.impact !== undefined) {
              interpretImpact(choice.impact, setUserChar, userChar);
            }
          }
        });
      }
    }
  } else {
    throw new Error("No choices in the story dico");
  }
}

/**
 * Function to check if the character is dead
 */
function deadButton() {
  let sectionId = localStorage.getItem("sectionId");
  if (sectionId !== null && sectionId !== undefined && sectionId !== 13) {
    if (localStorage.getItem("dead") === null) {
      localStorage.setItem("dead", 1);
    }
  }
}

/**
 * Const async version of the function launchDices
 * @param {*} numberOfDice The number of dice to launch
 * @returns The result of the dices
 */
const launchDices = async (numberOfDice, setDiceValue) => {
  //localStorage.setItem("numberOfDices", numberOfDice);
  setDiceValue(numberOfDice);
  //wait to be sure that the value is set
  await new Promise((resolve) => setTimeout(resolve, 300));
  const res = await rollAllDices();
  return res;
};

/**
 * Function to interpret the require section of a fight
 * @param { Object } action The action dico
 * @param { Integer } choiceNumber The number of the choice
 * @param { Object } char The character dico
 * @param { Integer } currEnemyHealth The resistance of the enemy
 * @param { Function } setCurrEnemyHealth The function to set the enemy current health
 * @param { Function } setCombatInfo The function to set the combat info
 * @param { Function } setMaxEnemyHealth The function to set the enemy max health
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretRequireFight(action, choiceNumber, char, currEnemyHealth, setCurrEnemyHealth, setCombatInfo, setMaxEnemyHealth, userChar, setUserChar)
{
  let item_type, item;
  if (action.choices[choiceNumber].require.action) {
    item_type = action.choices[choiceNumber].require.action.type;
    item =
      action.choices[choiceNumber].require.action[item_type][
        `id_${item_type}`
      ];
  } else {
    item_type = action.choices[choiceNumber].require.type;
    item =
      action.choices[choiceNumber].require[item_type][`id_${item_type}`];
  }
  let charItems = Object.keys(char.stuff.stuff[0]);
  if (charItems.includes(item.toString())) {
    let storyId = localStorage.getItem("storyId");
    API("stuff/" + storyId + "/" + item).then((itemResp) => {
      item = itemResp[0];
      if (currEnemyHealth < char.stats.strength + item.stats.strength) {
        setCombatInfo("win");
        setMaxEnemyHealth(null);
      } else {
        action.enemy.resistance -= char.stats.strength;
        editStat("-", action.enemy.strength, 'resistance', char.stats, userChar, setUserChar)
        if (char.stats.resistance > 0) {
          setCombatInfo("during");
          setCurrEnemyHealth(action.enemy.resistance);
        } else {
          checkIfDead();
          setCombatInfo("lose");
          setMaxEnemyHealth(null);
        }
      }
    });
  }
}

/**
 * Function to interpret the fight if no require section in the fight
 * @param { Object } action The action dico
 * @param { Object } char The character dico
 * @param { Integer } currEnemyHealth The resistance of the enemy
 * @param { Function } setCurrEnemyHealth The function to set the current enemy health
 * @param { Function } setCombatInfo The function to set the combat info
 * @param { Function } setMaxEnemyHealth The function to set the enemy max health
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretNoRequireFight(action, char, currEnemyHealth, setCurrEnemyHealth, setCombatInfo, setMaxEnemyHealth, userChar, setUserChar)
{
  if (currEnemyHealth < char.stats.strength) {
    setCombatInfo("win");
    setMaxEnemyHealth(null);
  } else {
    action.enemy.resistance -= char.stats.strength;
    editStat("-", action.enemy.strength, 'resistance', char.stats, userChar, setUserChar);
    if (char.stats.resistance > 0) {
      setCombatInfo("during");
      setCurrEnemyHealth(action.enemy.resistance);
    } else {
      checkIfDead();
      setCombatInfo("lose");
      setMaxEnemyHealth(null);
    }
  }
}

/**
 * The function to interpret the fight
 * @param { Object } action The action dico
 * @param { Function } setCombatInfo The function to set the combat info
 * @param { Integer } choiceNumber The number of the choice
 * @param { Function } setSectionId The function to set the section id
 * @param { Function } setDiceValue The function to set the dice value
 * @param { Integer } currEnemyHealth The enemy's current health
 * @param { Function } setCurrEnemyHealth The function to set the enemy health
 * @param { Integer } maxEnemyHealth The enemy's max health
 * @param { Function } setMaxEnemyHealth The function to set the enemy max health
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretFight(action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar)
{
  if (action.choices[choiceNumber].text.toLowerCase().includes("flee")) {
    gotoSection(action.choices[choiceNumber].goto, setSectionId, setDiceValue);
  }
  else {
    if(!maxEnemyHealth) {
      setMaxEnemyHealth(action.enemy.resistance);
    }
    else{
      API("characters/" + getCharaId()).then((char) => {
        char = char[0];
        if (action.choices[choiceNumber].require) {
          interpretRequireFight(action, choiceNumber, char, currEnemyHealth, setCurrEnemyHealth, setCombatInfo, setMaxEnemyHealth, userChar, setUserChar);
        } else {
          interpretNoRequireFight(action, char, currEnemyHealth, setCurrEnemyHealth, setCombatInfo, setMaxEnemyHealth, userChar, setUserChar);
        }
      });
    }
  }
}

/**
 * Function to add a path in the database
 * @param {*} id_sections The id of the section
 * @param {*} id_character The id of the character
 */
function addPath(id_sections, id_character) {
  let path = {
    id_character,
    id_sections,
  };
  API("paths", "POST", path);
}

/**
 * Function to interpret the action from the click of the button
 * @param { Integer } gotoId The id of the goto section
 * @param { Integer } choiceNumber The number of the choice
 * @param { Function } setSectionId THhe function to set the section id
 * @param { Function } setCombatInfo The function to set the combat info
 * @param { Function } setGotoSectionId THhe function to set the goto section id
 * @param { Function } sectionChoice The choice of the section
 * @param { Function } setDiceValue The function to set the dice value
 * @param { Integer } currEnemyHealth The enemy's current health
 * @param { Function } setCurrEnemyHealth The function to set enemy's current health
 * @param { Integer } maxEnemyHealth The enemy's max health
 * @param { Function } setMaxEnemyHealth The function to set the enemy's max health
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
function interpretAction(gotoId, choiceNumber, setSectionId, setCombatInfo, setGotoSectionId, sectionChoice, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar) {
  if (!checkIfDead()) {
    let storyID = localStorage.getItem("storyId");
    let currentSectionId = localStorage.getItem("sectionId");
    let section = {};
    API("sections/" + storyID + "/" + currentSectionId).then(async (res) => {
      section = res[0];
      if (gotoId !== null) {
        if (section.content.action.type === "story") {
          interpretStory(section.content.action, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar);
        } else if (section.content.action.type === "combat") {
          interpretFight( section.content.action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar );
        }
      } else {
        if (sectionChoice.goto !== undefined) {
          gotoId = sectionChoice.goto;
        }

        if (section.content.action.type === "story") {
          interpretStory(section.content.action, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar);
        } else if (section.content.action.type === "combat") {
          interpretFight(section.content.action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar);
        }
      }
    });
  }
}

/**
 * Function to get the choices of a section
 * @param {*} id The id of the section
 * @returns A promise
 */
function getChoices(id) {
  let story_id = localStorage.getItem("storyId");
  return new Promise((resolve, reject) => {
    API("sections/" + story_id + "/" + id).then((storyRes) => {
      if (storyRes[0].id === 50) {
        resolve([]);
      } else {
        if (storyRes[0].content.action !== undefined) {
          if (storyRes[0].content.action.choices) {
            resolve(storyRes[0].content.action.choices);
          } else {
            API("choices/" + story_id + "/" + id).then((choicesRes) => {
              resolve(choicesRes);
            });
          }
        } else {
          resolve([]);
        }
      }
    });
  });
}

/**
 * Function to set the dice value and the dead value
 * @param {*} setDiceValue The function to set the dice value
 * @param {*} setDead The function to set the dead value
 * @returns A promise
 */
function setDiceAndDead(setDiceValue, setDead)
{
  return new Promise((resolve) => {
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
    resolve();
  });
}

function storyButtonChoice(adaptedOnClick, adaptedText="Next", targetIdSection="13") {
  return (
    <Button
      size={"small"}
      text={adaptedText}
      type={"story"}
      onClick={adaptedOnClick}
      targetIdSection={targetIdSection}
    />
  )
}

/**
 * Main function to interpret the choices of a section
 * @param {*} param0 The props of the component
 * @returns A JSX element
 */
const Choices = ({ id, setSectionId, section, setCombatInfo, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar }) => {
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
  const handleButtonClick = async (item, i) => {
    interpretAction(item.id_section_to || null, i, setSectionId, setCombatInfo, setGotoSectionId, item, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar);
    // wait that "numberOfDices" of the localStorage and dead in localStorage is set
    await setDiceAndDead(setDiceValue, setDead);
  };

  useEffect(() => {
    getChoices(id).then((res) => {
      setChoices(res);
    });
  }, [story_id, id]);

  useEffect(() => {
    setCurrEnemyHealth(maxEnemyHealth);

    if(maxEnemyHealth){
      setCombatInfo('during');
    }
  }, [maxEnemyHealth])

  return (
    <div className="container-choices-dices">
      <Dices nbDices={diceValue} />
      <div className="container-choices">
        {dead === 1 && gotoSectionId !== 13 ? (
          storyButtonChoice(() => gotoSection(13, setSectionId, setDiceValue))
        ) : gotoSectionId !== 0 ? (
          storyButtonChoice(() => {
              gotoSection(gotoSectionId, setSectionId, setDiceValue);
              setGotoSectionId(0);
          }, "Next", gotoSectionId)
        ) : id === 50 ? (
          storyButtonChoice(() => window.location = "/ending", "End the story")
        ) : (
          choices && choices.map((item, i) => {
            if (!item.victory && !item.lose) {
              let targetIdSections = [];
              let diceResult = item?.require?.action?.diceResult;
              if (item.goto) {
                targetIdSections.push(item.goto);
              } else if (diceResult) {
                for (let j = 0; j < diceResult.length; j++) {
                  if (diceResult[j].goto) {
                    targetIdSections.push(diceResult[j].goto);
                  }
                }
              }
              if (targetIdSections.length !== 0 && targetIdSections.length !== 1) throw new Error("");

              return storyButtonChoice(() => {
                handleButtonClick(item, i);
              }, item.content || item.text, targetIdSections[0]);
            }
            return null;
          }
        )
        )}
      </div>
    </div>
  );
};

export default Choices;
