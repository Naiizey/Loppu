import './sliderButton.css'

const SliderButton = ({type, Icon, text}) => {
    return(
        <div>
            <button type="button" className={`slider-button-${type}`}><Icon/>{text}</button>
        </div>
    );
}

export default SliderButton;