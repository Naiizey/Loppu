import { useState, useEffect } from "react";
import "./loader.css";

const Loader = ({ loading }) => {
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (!loading) {
            setIsFading(true);
        }
    }, [loading]);

    return (
        <div
            className={`loaderComponent ${isFading ? "fade-out" : ""}`}
            style={{ display: isFading ? "none" : "flex" }}
        >
            <section></section>
            <section></section>
            <section></section>
            <section></section>
            <section></section>
            <section></section>
        </div>
    );
};

export default Loader;
