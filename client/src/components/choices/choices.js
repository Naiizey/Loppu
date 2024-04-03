import React from 'react';
import './choices.css';
import '../button/button';
import Button from '../button/button';
import { useEffect, useState } from "react";
import API from "../../utils/API";




const Choices = ({ id, setSectionId }) => {

    const [choice, setChoice] = useState({
        id: 0,
        id_book_section: 0,
        content: {
            action : {
                text : "",
            }
        },
        image: "",
        story_id: 0,
        title: "",
        type_id: 0,
    });
    
    useEffect(() => {
        API("choices/" + id).then((res) => {
            res = res[0];
            console.log(res);
        });
    }, [id]);

    return (
        <div>
            {/* buttons to do the differents actions */}
            {/* {getJson.res.map((item, i) => {
                if (Number(item.id_section_from) === id) {
                    return (
                        
                            <Button 
                                key={i}
                                size={"small"}
                                type={"info"}
                                text={item.content}
                                onClick={ ()=>{setSection(item.id_section_to); setSectionId(item.id_section_to)}}
                                

                            />
                        
                    )
                }
                return null;
            })} */}
        </div>
    )
};

export default Choices;