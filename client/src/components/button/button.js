import "./button.css";

const Button = ({buttonType, size, type, Icon, text, onClick, targetIdSection}) => {
    return(
        <div className={`${size}ButtonComponent`}>
            <button type={buttonType || "button"} className={`button-${type}`} title={type === "incoming" ? "Incoming" : ""} onClick={onClick}>
                { Icon && <Icon/> }{text}{targetIdSection && <span>Sec. {targetIdSection}</span>}
            </button>
        </div>
    )
};

export default Button
