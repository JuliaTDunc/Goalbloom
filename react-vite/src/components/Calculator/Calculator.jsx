import React, { useState } from "react";
import "./Calculator.css";

const Calculator = () => {
    const [input, setInput] = useState("0");

    const handleClick = (value) => {
        if (value === "AC") {
            setInput("0");
        } else if (value === "=") {
            try {
                setInput(eval(input).toString());
            } catch {
                setInput("Error");
            }
        } else {
            setInput(input === "0" ? value : input + value);
        }
    };

    return (
        <div className="c-box glowing">
            <div className="calculator-container">
                <input type="text" className="calculator-display" value={input} readOnly />
                <div className="keypad">
                    <button className="clear" onClick={() => handleClick("AC")}>AC</button>
                    <button className="operator" onClick={() => handleClick("(")}>(</button>
                    <button className="operator" onClick={() => handleClick(")")}>)</button>
                    <button className="operator" onClick={() => handleClick("/")}>÷</button>

                    <button onClick={() => handleClick("7")}>7</button>
                    <button onClick={() => handleClick("8")}>8</button>
                    <button onClick={() => handleClick("9")}>9</button>
                    <button className="operator" onClick={() => handleClick("*")}>×</button>

                    <button onClick={() => handleClick("4")}>4</button>
                    <button onClick={() => handleClick("5")}>5</button>
                    <button onClick={() => handleClick("6")}>6</button>
                    <button className="operator" onClick={() => handleClick("-")}>−</button>

                    <button onClick={() => handleClick("1")}>1</button>
                    <button onClick={() => handleClick("2")}>2</button>
                    <button onClick={() => handleClick("3")}>3</button>
                    <button className="operator" onClick={() => handleClick("+")}>+</button>

                    <button className="zero" onClick={() => handleClick("0")}>0</button>
                    <button onClick={() => handleClick(".")}>.</button>
                    <button className="equal" onClick={() => handleClick("=")}>=</button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
