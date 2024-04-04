import { useState, useEffect } from "react";
import "./loader.css";

const Loader = ({ loading }) => {
    const [isFading, setIsFading] = useState(false);
    const [hasFaded, setHasFaded] = useState(false);
    useEffect(() => {
        if (!loading) {
            setIsFading(true);
            setTimeout(() => {
                setHasFaded(true);
            }, 500);
        }
    }, [loading]);

    return (
        <div
            className={`loaderComponent ${isFading ? "fade-out" : ""}`}
            style={{ display: hasFaded ? "none" : "flex" }}
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
