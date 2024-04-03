import React from 'react';
import './choices.css';
import '../button/button';
import Button from '../button/button';

const Choices = ({ id, setSectionId }) => {
    function setSection(id) {
        console.log(id);
        let cookiesTime = new Date();
        cookiesTime = cookiesTime.setDate(cookiesTime.getDate() + 14);
        document.cookie = `sectionId=${id}; expires=${new Date(cookiesTime).toUTCString()}`;
    }
    const getJson = {
        res: [{ "id_story": "1", "id_section_from": "1", "id_section_to": "26", "content": "You have opened the gates", "impact": "{}", "victory": "false", "lose": "false", "parent_key": "0" },
        { "id_story": "1", "id_section_from": "1", "id_section_to": "50", "content": "Go back to your cave", "impact": "{}", "victory": "false", "lose": "false", "parent_key": "choices-1" }]
    }
    return (
        <div>
            {/* buttons to do the differents actions */}
            {getJson.res.map((item, i) => {
                if (Number(item.id_section_from) === id) {
                    return (
                        
                            <Button 
                                key={i}
                                size={"small"}
                                type={"info"}
                                text={item.content}
                                onClick={ ()=>setSection(item.id_section_to)}

                            />
                        
                    )
                }
                return null;
            })}
        </div>
    )
}

export default Choices;