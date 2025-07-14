import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../Context/Store";


const Input = () => {
    const { 
        updateChat
     } = useStore();
     
    const messageReplay = useRef();
    const [inputValue, setInputValue] = useState('');
    const autoReplays = [
        {
            name: 'thanks',
            copy: '🙏 על הבעת תודה', 
            reply: 'יואאאווו מממש תודהנ איזה מרגש '

        },
        {
            name: 'negative',
            copy: '😡 על תגובה שלילית', 
            reply: 'לא מגניב בכלל, מי מדבר ככה?'

        },
        {
            name: 'appeal',
            copy: '☝️ על ערעור', 
            reply: 'תשמע, מה אתה אומר שנפתח את זה לדיון?'

        }, 
    ]

    const inputTypeHandel = async () => {

        const replay = await messageReplay.current.value;
        setInputValue(replay);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handelInputReplay(e);
        }
    }
    

    const handelInputReplay = (e) => {
        e.preventDefault();
        const replay = messageReplay.current.value;



        if (replay !== '') {

            updateChat(replay)
            messageReplay.current.value = '';
            setInputValue('');



        } else {
            console.log('Please type some text')
        }
    }


    const placeAutoReplay= (key) => {
        setInputValue(autoReplays[key].reply);
        messageReplay.current.value = autoReplays[key].reply
    }



    return (
        <div className="input">
        <div className="input__action-buttons">
            <p className="parag_18">תבניות מענה:</p>
            {autoReplays.map((message, key)=> {
                return (
                    <button onClick={()=>placeAutoReplay(key)} key={key} className={`basic-button white-button ${message.name}`}>{message.copy}</button>
                )

            })}
        </div>
        <form className={'input__form'} onSubmit={handelInputReplay} >
            <div className="input__textarea-wrapper basic-button white-button">
            <textarea
                onInput={inputTypeHandel}
                className="input__form-textarea basic-button white-button"
                ref={messageReplay}
                placeholder="ההודעה שלך"
                name="messageReplay"
                onKeyDown={handleKeyDown}
            />
            </div>

            <button className="basic-button"
                disabled={!inputValue}>
                שליחה
            </button>
        </form>
        </div>

    )

}

export default Input;