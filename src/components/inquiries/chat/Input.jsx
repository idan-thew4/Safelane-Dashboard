import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../Context/Store";
import TextareaAutosize from 'react-textarea-autosize';



const Input = () => {
    const {
        updateChat,
        inputWrapperHeight,
        setInputWrapperHeight
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
    const prevHeight = useRef(null);




    const inputTypeHandel = async () => {


        if (messageReplay.current.value === '') {
            setInputWrapperHeight(21);
            prevHeight.current = null;
        }


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
            setInputWrapperHeight(21);
            prevHeight.current = null;




        } else {
            console.log('Please type some text')
        }
    }


    const placeAutoReplay = (key) => {
        setInputValue(autoReplays[key].reply);
        messageReplay.current.value = autoReplays[key].reply
    }

    useEffect(() => {

        setInputWrapperHeight(21)

    }, [])



    return (
        <div className="input" style={{ flex: `0 0 ${inputWrapperHeight}rem` }}>
            <div className="input__action-buttons">
                <p className="parag_18 input__templates_headline">תבניות מענה:</p>
                {autoReplays.map((message, key) => {
                    return (
                        <button onClick={() => placeAutoReplay(key)} key={key} className={`basic-button white-button ${message.name}`}>{message.copy}</button>
                    )

                })}
            </div>
            <form className={'input__form'} onSubmit={handelInputReplay} >
                <div className="input__textarea-wrapper basic-button white-button">
                    <TextareaAutosize
                        className="input__form-textarea basic-button white-button"
                        placeholder="ההודעה שלך"
                        name="messageReplay"
                        onKeyDown={handleKeyDown}
                        onInput={inputTypeHandel}
                        maxRows={4}
                        ref={messageReplay}

                        onHeightChange={height => {

                            if (messageReplay.current.value !== '') {

                                if (height > prevHeight.current) {
                                    setInputWrapperHeight(h => h + 1.5);
                                } else if (height < prevHeight.current) {
                                    setInputWrapperHeight(h => h - 1.5);
                                }
                                prevHeight.current = height;


                            }


                        }}




                    />

                    {/* 
                    <textarea
                        onInput={inputTypeHandel}
                        className="input__form-textarea basic-button white-button"
                        ref={messageReplay}
                        placeholder="ההודעה שלך"
                        name="messageReplay"
                        onKeyDown={handleKeyDown}
                    /> */}
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