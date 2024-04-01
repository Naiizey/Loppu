import './sliderButton.css'

const SliderButton = ({type, Icon, text, onClick}) => {
    return(
        <div>
            <button type="button" className={`slider-button-${type}`} title={type === "incoming" ? "Incoming" : ""} onClick={onClick}><Icon/>{text}</button>
        </div>
    );
}

export default SliderButton;