import React, { useEffect } from "react";
import chatEmpty from "../../assets/chat-is-empty.svg"
import Messages from "./chat/Messages";
import { useStore } from "../../Context/Store";
import InquiryHeader from "./chat/InquiryHeader";
import Input from "./chat/input";
import loader from "../../assets/loader.svg";



const Chat = () => {
    const { ticketData,chatLoader, setChatLoader  } = useStore();

    useEffect(()=>{

        console.log(chatLoader)

    }, [chatLoader])

    if(chatLoader) {
        return <div className="loader__wrapper">
        <img src={loader}/>
    </div>;

    }



    if (!ticketData) {
        return (
            <div className="inquiry__chat-empty">
                <img src={chatEmpty} />
                <p className="head_24_secondary">נא לבחור התכתבות לצפייה</p>
            </div>

        )

    }



    return (
        <div className="inquiry__chat-full">
            <InquiryHeader 
            id = {ticketData.ticket_id}
            />
            <Messages
            id = {ticketData.ticket_id}
            content={ticketData.chat}
            />
            <Input type={'waiting-time'}/>
            
        </div>

    )

}

export default Chat;