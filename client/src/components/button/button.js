import './button.css'

const Button = ({size, type, Icon, text, onClick}) => {
    console.log(size, type, Icon, text, onClick);
    return(
        <div className={`${size}ButtonComponent`}>
            <button type="button" className={`button-${type}`} title={type === "incoming" ? "Incoming" : ""} onClick={onClick}>{ Icon && <Icon/> }{text}</button>
        </div>
    )
};

export default Button