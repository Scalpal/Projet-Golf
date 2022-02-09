import { useState, useEffect } from 'react'


function Input ({inputType, inputName, inputValue}){

    const [inputValue , setInputValue] = useState('')

    return(
        <React.Fragment>
            <label for={inputName}>{inputName}</label>
            <input type={inputType} name={inputName} onChange={(e) => {
                setInputValue(e.target.value)
            }} />
        </React.Fragment>
    )
}

export default Input