import { useEffect, useState } from "react";
import "./storyProgress.css";
import API from "../../utils/API";

const StoryProgress = ({ storyId, storyTitle, sectionId, sectionTitle }) => {
    const [lastSections, setLastSections] = useState([]);
    useEffect(() => {
        API("paths/" + localStorage.getItem("charaId")).then((res) => {
            // We retrieve the three last sections
            if (res.length > 3) res = res.slice(-3);
            setLastSections(res);
        });
    }, [sectionId, storyId]);

    const [lastSectionsTitles, setLastSectionsTitles] = useState([]);
    useEffect(() => {
        if (lastSections.length > 0) {
            let tempSectionsTitles = [];
            for (let i = 0; i < lastSections.length; i++) {
                API("sections/" + storyId + "/" + lastSections[i].id_sections).then((sectionRes) => {
                    tempSectionsTitles.push(sectionRes[0].title);
                });
            }
            console.log(lastSections, tempSectionsTitles);
            setLastSectionsTitles(tempSectionsTitles);
        }
    }, [storyId, lastSections]);

    return (
        <div className="storyProgressComponent">
            <div>
                <ol>
                    {lastSections.map((section, index) => {
                        return (
                            <li key={section.id} title={lastSectionsTitles[index]}>
                                <h3>{section.id_sections}</h3>
                            </li>
                        );
                    })}
                    <hr />
                </ol>
                <hr />
            </div>
            <div>
                <h2>{storyTitle}</h2>
                <h3>{sectionTitle}</h3>
                <h4>Section {sectionId}</h4>
            </div>
        </div>
    );
};

export default StoryProgress;
