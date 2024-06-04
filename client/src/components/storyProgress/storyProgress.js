import { useEffect, useState } from "react";
import "./storyProgress.css";
import API from "../../utils/API";

const StoryProgress = ({ storyTitle, sectionId, sectionTitle }) => {
    const [lastSections, setLastSections] = useState([]);
    useEffect(() => {
        API("paths/" + 1).then((res) => {
            // We retrieve the three last sections
            if (res.length > 3) res = res.slice(-3);
            setLastSections(res);
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
                <h2>{storyTitle}</h2>
                <h3>{sectionTitle}</h3>
                <h4>Section {sectionId}</h4>
            </div>
        </div>
    );
};

export default StoryProgress;
