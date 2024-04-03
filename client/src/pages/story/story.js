import "./story.css";
import API from "../../utils/API";
import { useEffect, useState } from "react";

const SectionPage = () => {
  const [title, setTitle] = useState("----------");
  useEffect(() => {
    API("stories/1").then((res) => {
      setTitle(res[0].title);
    });
  }, []);

  const [data, setData] = useState({
    id: 0,
    title: "",
    story_id: 0,
    content: {
      text: "",
    },
  });
  useEffect(() => {
    API("sections/story/1").then((res) => {
      setData(res[0]); // TODO: set it to the current section id, not a generic one
      console.log(res[0]);
    });
  }, []);
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
            </ol>
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
    </main>
  );
};

export default SectionPage;
