import React from 'react';
import './characterSelection.css';
import CharacterSheet from '../../components/characterSheet/characterSheet';

const characterSelection = () => {
    return (
        <main id="characterSelection">
            <h1>Choose your character</h1>
            <ul>
                <CharacterSheet img="https://via.placeholder.com/150" name="John" strength="10" intelligence="5" resistance="8" luck="3" perso="John"/>
                <CharacterSheet img="https://via.placeholder.com/150" name="Jane" strength="5" intelligence="10" resistance="3" luck="8" perso="Jane"/>
                <CharacterSheet img="https://via.placeholder.com/150" name="Jack" strength="8" intelligence="3" resistance="10" luck="5" perso="Jack"/>
            </ul>
        </main>
    )
};

export default characterSelection;
