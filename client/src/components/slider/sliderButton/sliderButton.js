import './sliderButton.css';
import Button from '../../button/button';

const SliderButton = ({type, Icon, text, onClick}) => {
    return(
        <div>
            <Button size="large" type={type} Icon={Icon} text={text} onClick={onClick}/>
        </div>
    );
}

export default SliderButton;
