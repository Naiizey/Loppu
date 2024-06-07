import "./button.css";

const Button = ({buttonType, size, type, Icon, text, onClick, targetIdSection, diceStats}) => {
    return(
        <div key={targetIdSection} className={`${size}ButtonComponent`}>
            <button type={buttonType || "button"} className={`button-${type}`} title={type === "incoming" ? "Incoming" : ""} onClick={onClick}>
                { Icon && <Icon/> }
                {text}
                {diceStats && diceStats.length >= 1 && (
                    <span> ({diceStats.map((elem, index) => 
                        `${elem}${index < diceStats.length - 1 ? ', ' : ''}`
                    )}) </span>
                )}
                {targetIdSection && <span>Sec. {targetIdSection}</span>}
            </button>
        </div>
    )
};

export default Button;

