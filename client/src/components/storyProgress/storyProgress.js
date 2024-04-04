import { useEffect, useState } from "react";
import "./storyProgress.css";
import API from "../../utils/API";

const StoryProgress = ({ section: sectionId }) => {
    const [lastSections, setLastSections] = useState([]);
    useEffect(() => {
        API("paths/" + 1 + "/" + sectionId).then((res) => {
            // We retrieve the three last sections
            console.log(res);
            setLastSections(res.slice(-3));
        });
    }, [sectionId]);
    return (
        <div className="storyProgressComponent">
            <div>
                <ol>
                    {lastSections.map((section) => {
                        return (
                            <li key={section.id}>
                                <h3>{section.id_sections}</h3>
                            </li>
                        );
                    })}
                    <hr />
                </ol>
                <hr />
            </div>
            <div>
                <h2>Rampage</h2>
                <h3>section {sectionId}</h3>
            </div>
        </div>
    );
};

export default StoryProgress;
