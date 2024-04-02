import './rangeInput.css'

const RangeInput = ({inputValue, setInputValue}) => {
    return(
        <div className="rangeInputComponent">
            <h4>Font size <span>{inputValue}px</span></h4>
            <input type="range" min="0" max="30" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input>
        </div>
    )
}

export default RangeInput;