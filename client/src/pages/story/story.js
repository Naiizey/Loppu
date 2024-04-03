import "./story.css";
import { useState } from "react";
import Choices from '../../components/choices/choices'
import API from "../../utils/API";
import { useEffect } from "react";

const SectionPage = () => {
    const [title, setTitle] = useState("");
    

    const [data, setData] = useState({
        id: 0,
        title: "",
        story_id: 0,
        content: {
            text: "",
        },
    });
    

    const defaultSection = 1;
    const [sectionId, setSectionId] = useState(document.cookie.split("sectionId=")[1] || defaultSection);
    
    // useEffect(() => {
    // API("sections/story/1").then((res) => {
    //     setData(res[0]);
    // });
    // }, []);
    API("sections/"+  sectionId).then((res)=> {
        const section = res
        console.log(section);
    })

    

    return ( 
        <main id="section">
            <section>
                <div>
                    <div className="progress">
                        <ol>
                            <li>
                                <p>1</p>
                                <p>Genesis</p>
                            </li>
                            <li>
                                <p>2</p>
                                <p>Tavern</p>
                            </li>
                            <li>
                                <p>3</p>
                                <p>Village</p>
                            </li>
                            <hr />
                            <hr />
                        </ol>
                        <hr />
                        <hr />
                    </div>
                    <div>
                        <h2>{title}</h2>
                        <h3>section {data.id} - village</h3>
                    </div>
                </div>
                <article>
                    <p>{data.content.text}</p>
                </article>
            </section>
            <Choices
                id={sectionId}
                setSectionId={setSectionId}
            />
        </main >
    )
};

export default SectionPage;

