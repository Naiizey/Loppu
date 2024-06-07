import React from "react";
import "./choices.css";
import "../button/button";
import Button from "../button/button";
import { useEffect, useState } from "react";
import API from "../../utils/API";
import Dices from "../../components/dices/dices";
import { rollAllDices } from "../../components/dices/dices";
// import { get } from "../../../../server/routes/paths";

/**
 * Function to get the id of the character from the local storage
 * @returns the id of the character
 */
function getCharaId() {
  return localStorage.getItem("charaId");
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
 * @param { Integer } key  The key of the dico
 * @param { Object } dico The impact dico
 * @param { Object } userChar The character informations
 * @param { Function } setUserChar The function to set the character informations
 */
async function impactInventory(key, dico, userChar, setUserChar) {
  for (const index in dico[key]) {
    let item = dico[key][index];
    let operator = item.operator;

    const itemIdType = await API(
      "stuff/" + localStorage.getItem("storyId") + "/" + item.id_item, "GET"
    ).then((item) => {
      return {
        "item_type": item[0].item_type,
        "id_item": item[0].id_item
      }
    });

    if (operator !== undefined) {
      let charaId = getCharaId();
      let itemId = item.id_item;
      switch (operator) {
        case "+":
          await API(
            "characters/" + charaId + "/inventory/" + itemId,
            "PUT"
          ).then(() => {});

          break;
        case "-":
          await API(
            "characters/" + charaId + "/inventory/" + itemId,
            "DELETE"
          ).then(() => {});

          break;
        default:
          break;
      }
    }

    const haveItem = Object.values(userChar.stuff).map(inventory => {
      const isInStuff = inventory.map(mappedItem => {
        return parseInt(Object.keys(mappedItem)[0]) === item.id_item
      }).filter(isItem => isItem)

      return isInStuff
    }).map(inventory => inventory.length !== 0);

    if(!haveItem.includes(true) && item.operator === "-"){
      console.error("Tentative de retrait d'un item que vous ne possédez pas");
    }
    else{
      const userCharCopy = {...userChar};

      const toAddItem = {}
      toAddItem[itemIdType.id_item] = itemIdType.item_type;

      if(itemIdType.item_type === "weapon"){
        userCharCopy.stuff.stuff.push(toAddItem);
      }
      else{
        userCharCopy.stuff.inventory.push(toAddItem);
      }

      setUserChar(userCharCopy);
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
          impactInventory(key, dico, userChar, setUserChar);
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
    interpretImpact(impact, userChar, setUserChar);
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
            diceResultConsequances(element, setGotoSectionId, userChar, setUserChar);
          }
        });
        break;
      case "equalsTo":
        let value = element.value;
        if (diceValue === value) {
          diceResultConsequances(element, setGotoSectionId, userChar, setUserChar);
        }
        break;
      case "fromTo":
        let from = element.from;
        let to = element.to;
        if (diceValue >= from && diceValue <= to) {
          diceResultConsequances(element, setGotoSectionId, userChar, setUserChar);
        }
        break;
      default:
        break;
    }
  }
  return true;
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
function undefinedActionProcess(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, reject, userChar, setUserChar, setDisplayButtonIdGoto)
{
  switch (dico.action.type) {
    case "dice":
      launchDices(dico.action.numberOfDice, setDiceValue).then((res) => {
        let ret = interpretDiceResult(dico.action, res, setGotoSectionId, userChar, setUserChar);
        if (dico.action.win !== undefined) {
          notDeadRequireProcess(dico, setGotoSectionId, userChar, setUserChar);
        }
        if (dico.action.lose !== undefined) {
          deadRequireProcess(dico, setGotoSectionId, userChar, setUserChar);
        }
        if (ret) {
          if (dico.action.goto !== undefined) {
            setDisplayButtonIdGoto(dico.action.goto);
          }
        }
      });
      break;
    case "story":
      interpretStory(dico, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto);
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
function interpretRequireStory(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto)
{
  return new Promise((resolve, reject) => {
    if (dico.action !== undefined) {
      undefinedActionProcess(dico, setGotoSectionId, choiceNumber, gotoId, setSectionId, setDiceValue, reject, userChar, setUserChar, setDisplayButtonIdGoto);
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
function interpretStory(story, gotoID, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto)
{
  let choices = story.choices;
  if (choices !== undefined && choices.length > 0) {
    let choice = choices[choiceNumber];
    if (choice.goto !== undefined) {
      if (choice.goto === gotoID && choice.require === undefined) {
        if (choice.require === undefined) {
          if (choice.impact !== undefined) {
            interpretImpact(choice.impact, userChar, setUserChar);
          }
        } else {
          interpretRequireStory(choice.require, setGotoSectionId, choiceNumber, gotoID, setSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto).then((result) => {
            if (result) {
              if (choice.impact !== undefined) {
                interpretImpact(choice.impact, userChar, setUserChar);
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
          interpretImpact(choice.impact, userChar, setUserChar);
        }
      } else {
        interpretRequireStory(choice.require, setGotoSectionId, choiceNumber, gotoID, setSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto).then((result) => {
          if (result) {
            if (choice.impact !== undefined) {
              interpretImpact(choice.impact, userChar, setUserChar);
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
function interpretFight(action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar, setDisplayButtonIdGoto)
{
  if (action.choices[choiceNumber].text.toLowerCase().includes("flee")) {
    gotoSection(action.choices[choiceNumber].goto, setSectionId, setDiceValue);
  }
  else {
    if(!maxEnemyHealth) {
      if (action.enemy !== undefined) 
      {
        setMaxEnemyHealth(action.enemy.resistance);
      }
      else
      {
        undefinedActionProcess(action.choices[choiceNumber], setSectionId, choiceNumber, action.choices[choiceNumber].goto, setSectionId, setDiceValue, undefined, userChar, setUserChar, setDisplayButtonIdGoto);
      }
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
function interpretAction(gotoId, choiceNumber, setSectionId, setCombatInfo, setGotoSectionId, sectionChoice, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar, setDisplayButtonIdGoto) {
  if (!checkIfDead()) {
    let storyID = localStorage.getItem("storyId");
    let currentSectionId = localStorage.getItem("sectionId");
    let section = {};
    API("sections/" + storyID + "/" + currentSectionId).then(async (res) => {
      section = res[0];
      if (gotoId !== null) {
        if (section.content.action.type === "story") {
          interpretStory(section.content.action, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto);
        } else if (section.content.action.type === "combat") {
          interpretFight( section.content.action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar, setDisplayButtonIdGoto );
        }
      } else {
        if (sectionChoice.goto !== undefined) {
          gotoId = sectionChoice.goto;
        }

        if (section.content.action.type === "story") {
          interpretStory(section.content.action, gotoId, setSectionId, choiceNumber, setGotoSectionId, setDiceValue, userChar, setUserChar, setDisplayButtonIdGoto);
        } else if (section.content.action.type === "combat") {
          interpretFight(section.content.action, setCombatInfo, choiceNumber, setSectionId, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar, setDisplayButtonIdGoto);
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
      if (storyRes.length === 0) {
        reject(new Error("Section "+ id + " not found in dataBase"));
      }
      else
      {
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

function storyButtonChoice(key, adaptedOnClick, adaptedText="Next", targetIdSection="13") {
  return (
    <Button
      key={key}
      size={"small"}
      text={adaptedText}
      type={"story"}
      onClick={adaptedOnClick}
      targetIdSection={targetIdSection}
    />
  )
}

/**
 * Function to check if a section is already visited
 * @param {int} sectionId The id of the section
 * @param {list} lstPathsVisited The list of the paths visited
 * @returns A boolean
 */
async function checkAlreadyVisited(sectionId, lstPathsVisited) {
  if (lstPathsVisited.includes(sectionId)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Function to get the real goto section id recursively
 * @param {int} gotoId The goto section id
 * @param {list} lstPathsVisited The list of the paths visited
 * @returns The real goto section id
 */
async function getRealGotoSectionIdRecurs(gotoId, lstPathsVisited) {
  if (gotoId === undefined || gotoId === null) {
    return gotoId;
  }
  let storyId = localStorage.getItem("storyId");
  let section = {};
  let res = await API("sections/" + storyId + "/" + gotoId)
  section = res[0].content;
  if (section.action !== undefined && section.action.alreadyVisited !== undefined) {
    if (lstPathsVisited !== undefined && lstPathsVisited !== null) {
      let isVisited = await checkAlreadyVisited(gotoId, lstPathsVisited);
      if (isVisited) {
        gotoId = section.action.alreadyVisited;
        return await getRealGotoSectionIdRecurs(gotoId, lstPathsVisited);
      }
    }
    else {
      console.log("lstPathsVisited is null");
    }
  }
  return gotoId;
}

/**
 * Function to get the paths visited by the character
 * @returns The list of the paths visited
 */
async function getPathsVisited() {
  let charaId = getCharaId();
  let lstVisited = [];
  const res = await API("paths/" + charaId);
  res.forEach((element) => {
    lstVisited.push(element.id_sections);
  });
  return lstVisited;
}

/**
 * Function to get the real goto section id
 * @param {int} gotoId The goto section id
 * @returns The real goto section id
 */
async function  getRealGotoSectionId(gotoId)
{
  const sectionsVisited = await getPathsVisited();
  const realId = await getRealGotoSectionIdRecurs(gotoId, sectionsVisited);
  return realId;
}

/**
 * Function to get the goto section id from a choice
 * @param {object} choice
 * @returns The goto section id
 */
function getGotoFromItem(choice)
{
  let targetIdSections = [];
  if (choice.goto !== undefined) {
    targetIdSections.push(choice.goto);
  }
  let diceResult = choice?.require?.action?.diceResult;
  if (diceResult) {
    for (let i = 0; i < diceResult.length; i++) {
      if (diceResult[i].goto) {
        targetIdSections.push(diceResult[i].goto);
      }
    }
  }
  return targetIdSections;
}

/**
 * Function to concatenate a list of elements to a string
 * @param {*} lst The list of elements
 * @returns The concatenated string
 */
function concat_to_string(lst)
{
  let str = "";
  lst.forEach((element) => {
    str += element + "|";
  });
  if (str.length > 0) {
    str = str.slice(0, -1);
  }
  return str;
}

/**
 * Function to get the win or lose section ids
 * @returns The concatenated string of the win or lose section ids
 */
async function getWinOrLoseSectionIds()
{
  let sectionID = localStorage.getItem("sectionId");
  let section = await API("sections/" + localStorage.getItem("storyId") + "/" + sectionID);
  let winSectionId = section[0]?.content?.action?.win?.goto;
  let loseSectionId = section[0]?.content?.action?.lose?.goto;
  let lst = [];
  if (winSectionId !== undefined && winSectionId !== null) {
    lst.push(winSectionId);
  }
  if (loseSectionId !== undefined && loseSectionId !== null) {
    lst.push(loseSectionId);
  }
  return concat_to_string(lst);
}

/**
 * Temporary setter for the target id sections
 * @param {Function} setTargetIdSections The function to set the target id sections
 * @param {object} element The element to set
 * @param {String} strSections The string of the sections
 */
function saveTargetIdSectionsTemporarySetter(setTargetIdSections, element, strSections)
{
  setTargetIdSections((prev) => {
    const index = prev.findIndex((tuple) => tuple[0] === element);
    if (index !== -1) {
      // Key exists, replace value
      return [
        ...prev.slice(0, index),
        [element, strSections],
        ...prev.slice(index + 1),
      ];
    } else {
      // Key doesn't exist, add new key-value pair
      return [...prev, [element, strSections]];
    }
  });
}

/**
 * Function to look for a "goto" property in a choice (recursive)
 * @param {object} choice The choice to look for
 * @returns A boolean
 */
function lookForGoto(choice) {
  // Base case: if the choice is an object and has a "goto" property,
  if (typeof choice === 'object' && choice !== null && 'goto' in choice) {
    return true;
  }

  // Recursive case: if the choice is an object, look for "goto" in its properties
  if (typeof choice === 'object' && choice !== null) {
    for (let key in choice) {
      const result = lookForGoto(choice[key]);
      if (result !== undefined && result === true) {
        return result;
      }
    }
  }

  return false;
}

/**
 * Function to get the expected section ids
 * @param {object} choices The list of choices
 * @param {Function} setTargetIdSections The function to set the target id sections
 */
async function getExpectedSectionIds(choices, setTargetIdSections)
{
  choices.forEach(async (item, i) => {
    if ((item.id_section_from === 0 && item.id_section_to === 0 && item.id_story === 0) || (lookForGoto(item) === false)) //
    {
      let strSections = await getWinOrLoseSectionIds();
      let element = undefined;
      saveTargetIdSectionsTemporarySetter(setTargetIdSections, element, strSections);
      return;
    }
    else
    {
      let targetIdSections = getGotoFromItem(item);
      targetIdSections.forEach(async (element) => {
        let realSectionId = await getRealGotoSectionId(element)
        if (realSectionId !== undefined && realSectionId !== null) {
          saveTargetIdSectionsTemporarySetter(setTargetIdSections, element, realSectionId);
        }
      });
    }

  });
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
    interpretAction(item.id_section_to || null, i, setSectionId, setCombatInfo, setGotoSectionId, item, setDiceValue, currEnemyHealth, setCurrEnemyHealth, maxEnemyHealth, setMaxEnemyHealth, userChar, setUserChar, setDisplayButtonIdGoto);
    // wait that "numberOfDices" of the localStorage and dead in localStorage is set
    await setDiceAndDead(setDiceValue, setDead);
  };

  const [targetIdSections, setTargetIdSections] = useState([]);

  const [displayButtonIdGoto, setDisplayButtonIdGoto] = useState(0);

  useEffect(() => {
    if (choices) {
      getExpectedSectionIds(choices, setTargetIdSections)
    }
  }, [choices]);

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
  }, [maxEnemyHealth, setCurrEnemyHealth, setCombatInfo]);

  return (
    <div className="container-choices-dices">
      <Dices nbDices={diceValue} />
      <div className="container-choices">
        {dead === 1 && gotoSectionId !== 13 ? (
          storyButtonChoice(113, () => gotoSection(13, setSectionId, setDiceValue), "Next", gotoSectionId)
        ) : gotoSectionId !== 0 ? (
          storyButtonChoice(gotoSectionId, () => {
              gotoSection(gotoSectionId, setSectionId, setDiceValue);
              setGotoSectionId(0);
          }, "Next", gotoSectionId)
        ) : id === 50 ? (
          storyButtonChoice(50, () => window.location = "/ending", "End the story")
        ) : 
        displayButtonIdGoto !== 0 ? (
          storyButtonChoice(displayButtonIdGoto,() => {
            gotoSection(displayButtonIdGoto, setSectionId, setDiceValue);
            setDisplayButtonIdGoto(0);
          }, "Next", displayButtonIdGoto)
        ) :
        (
          choices &&
          choices.map((item, i) => {
            let gotoFrom = getGotoFromItem(item)[0];
            const targetIdTuple = targetIdSections.find(
              (tuple) => tuple[0] === gotoFrom
            );
            if (!item.victory && !item.lose && targetIdTuple) {
              return storyButtonChoice(i, () => {
                handleButtonClick(item, i);
              }, item.content || item.text, targetIdTuple[0]);
            }
            else if (!item.victory && !item.lose)
            {
              return storyButtonChoice(i, () => {
                handleButtonClick(item, i);
              }, item.content || item.text);
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default Choices;
