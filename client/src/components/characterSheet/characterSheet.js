import React from 'react';
import './characterSheet.css';

function click(perso) {
    console.log(perso);
}

class characterSheet extends React.Component {
    render() {
        return (
            <li>
                <img src={this.props.img} alt={this.props.name}/>
                <h2>{this.props.name}</h2>
                <ul>
                    <li>
                        <p>Strength: </p>
                        <p>{this.props.strength}</p>
                    </li>
                    <li>
                        <p>Intelligence: </p>
                        <p>{this.props.intelligence}</p>
                    </li>
                    <li>
                        <p>Resistance: </p>
                        <p>{this.props.resistance}</p>
                    </li>
                    <li>
                        <p>Luck: </p>
                        <p>{this.props.luck}</p>
                    </li>
                </ul>
                <hr/>
                <p>Inventory:</p>
                <button onClick={click(this.props.perso)}>Choisir</button>
            </li>
        )
    }
}

export default characterSheet;