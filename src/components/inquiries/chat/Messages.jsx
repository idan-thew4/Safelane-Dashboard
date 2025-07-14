import { useEffect, useRef, useState } from "react";
import { useStore } from "../../../Context/Store";

const Messages = ({ id, content }) => {
    const {
        messagesContainer,
        setMessages,
        messages,
        tag,
        setTag,
        tagging,
        updateTicketTag,
        ticketData,
        inquiries,
        sideMenuType,
        setInquiries,
        updateChat

        // taggingTimeStamp,
        // setTaggingTimeStamp
    } = useStore();
    const StripTag = useRef();
    const [stripTag, setStripTag] = useState();
    let currentDate = '';
    const [representativeReplay, setRepresentativeReply] = useState(false);



    useEffect(() => {

        setMessages(content);

        Object.keys(content).map((item, index) => {

            if (index === 0) {
                currentDate = content[item][0];

            }
        });


    }, [content]);





    const copy = [
        {
            page: 'login',
            content: [{
                title: <>נעים מאוד<br></br> <span className='light'>אנחנו שומרי הדרך</span></>,
                text: 'אנחנו קבוצה של מתנדבים שמתעדים עבירות תנועה כדי לצמצם את מספר תאונות הדרכים',
                boxTitle: 'התחברות לצפייה בסרטון',
                boxText: 'מופיע במכתב שנשלח אליך',
                qrText: 'אחד מהמתנדבים שלנו תיעד את רכבך מבצע עבירת תנועה'
            }]
        },
        {
            page: 'ticket',
            content: [{
                title: 'סרטון התיעוד',
            },
            {
                title: 'פרטי העבירה',
            },
            {
                title: 'איך להשתפר',
                text: 'אספנו בשבילכם כמה טיפים קלים ונוחים כיצד למנוע את העבירה הבאה שלכם ולורם איפסום דולורס אמט'
            },
            {
                title: 'עוד עלינו',
                titleBox: 'רוצים לשמוע עוד?',
                headline: 'רוצים לקחת חלק בשינוי?',
                text: 'מורידים את אפליקציית המתנדבים שלנו, מתעדים עבירות ומצילים חיים.',
                qr: ['להורדת האפליקציה', 'https://www.techopedia.com/wp-content/uploads/2023/03/aee977ce-f946-4451-8b9e-bba278ba5f13.png'],
                more: 'רוצים לשמוע עוד עלינו?',
                cta: ['לאתר שלנו', 'https://www.rsa.org.il/'],
                appStoreLink: 'https://apps.apple.com/us/app/%D7%A9%D7%95%D7%9E%D7%A8%D7%99-%D7%94%D7%93%D7%A8%D7%9A/id1148135107',
                googleStoreLink: 'https://play.google.com/store/apps/details?id=com.safelane.nativ&hl=he&gl=US&pli=1'
            }]
        },
        {
            initialMessage: [{
                text1: 'היי! ההתכתבות היא אנונימית לחלוטין',
                text2: 'כדי לשמור על פרטיותך אנחנו מעבירים את מס׳ הרכב שביצע את העבירה למשרד התחבורה, הם אלה ששלחו לך את המכתב',
                text3: 'נשמח לשמוע כל הערה או שאלה שיש לך',
            }],
            firstReplyMessage: [{
                text: 'תודה שפנית אלינו! הפניה שלך נשלחה לנציגים ונענה תוך 5 ימי עסקים. את התשובה ניתן יהיה לראות כאן, בקישור הצפייה בסרטון',
                cta: 'להעתקת הקישור',
                link: 'http://link.com/q232sdw',
                question: 'רוצה שנעדכן אותך כשתשובה תגיע?',
            }]
        },
    ]


    //*TODO: send tagginh update time to endpoint//

    const getTimeStamp = (item, date = false, fullDAte = false) => {

        let time = new Date(parseInt(item));
        let formattedDate = '';
        const day = time.getDate().toString().padStart(2, '0');
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        formattedDate = `${day}.${month}.${year}`;


        if (fullDAte) {
            const lastTime = new Date(currentDate);


            let differentDaysMonthsYears = time.getDate() !== lastTime.getDate() ||
                time.getMonth() !== lastTime.getMonth() ||
                time.getFullYear() !== lastTime.getFullYear();

            if (differentDaysMonthsYears) {
                const weekDay = time.getDay();
                const weekDays = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש',];
                currentDate = item;

                return <li className="full-date-stamp parag_14_main">{`יום  ${weekDays[weekDay]}’, ${formattedDate}`}</li>;
            }
            // return "Are the timestamps on different days, months, and years?" + differentDaysMonthsYears





        } else {
            return `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()} ${date ? ', ' + formattedDate : ''}`;

        }


    }

    const autoReplayMessage = (messageType, timeStamp, firstValue, secondValue) => {

        switch (messageType.split('_')[0]) {
            case 'user':
                return <p className="parag_13 message__context">{messages[messageType][1]}</p>;
                break;
            case 'admin':
                return <p className="parag_13 message__context">{messages[messageType][1]}</p>;
            case 'tag-strip':
                return <div className="action-bar">
                    <p className="parag_16 ">אופי הפניה תויג כ<strong >{tagging[messages[messageType][1]].copy}</strong>
                        <span className="light">{getTimeStamp(new Date().getTime(), true)}</span>
                    </p>
                </div>

        }

    }


    //Copy link in auto replay message - function
    useEffect(() => {

        const copy_buttons = document.querySelectorAll('.copy-button');

        copy_buttons.forEach((button) => {

            button.addEventListener('click', () => {
                button.classList.add('copied');
                navigator.clipboard.writeText(button.innerHTML);
                button.innerHTML = 'הועתק';
            })

        })


    }, [])




    //Update tag
    const updateTag = (tag) => {
        setTag(tag);
        updateTicketTag(ticketData['wp-ticket-id'], tag);
        setStripTag(tag);
        updateChat(tag, false);
        const updatedInquiries = { ...inquiries };

        updatedInquiries[sideMenuType];
        const selectedTab = updatedInquiries[Object.keys(updatedInquiries)[sideMenuType]];

        selectedTab.map((item, index) => {

            if (String(item["wp-ticket-id"]) === ticketData['wp-ticket-id']) {
                item['tagging'] = tag;
                setInquiries(updatedInquiries);
            }

        })

    }






    return (
        <>
            <div></div>
            <ul className="messages" ref={messagesContainer}>

                {Object.keys(messages).map((item, index) => {



                    if (
                        messages[item][1] === 'welcomeMessage' ||
                        messages[item][1] === 'firstReplyMessage' ||
                        messages[item][1] === 'sendFormMessage' ||
                        messages[item][1] === 'formDetailsSaved' ||
                        messages[item][1] === 'noUpdatesSummaryMessage' ||

                        //*TODO: Replace generated yes and no question to uniqe messageType in website function and switch to Hebrew when printing // 
                        messages[item][1] === 'לא, תודה' ||
                        messages[item][1] === 'כן, עדכנו אותי'
                    ) {
                        return null
                    } else {




                        return messages[item][1] === 'sendFormMessage' && messages[item][2] ? null :
                            <>
                                {getTimeStamp(messages[item][0], false, true)}

                                { }


                                <li className={Object.keys(messages).length > 1 ? `message__single ${item.split('_')[0]}` : `message__single animate ${item.split('_')[0]}`
                                } key={index}>
                                    {messages[item][2] !== 'tag-strip' &&
                                        <p className="parag_10 message__time">{getTimeStamp(messages[item][0])}</p>}
                                    {autoReplayMessage(item, messages[item][0], messages[item][2], messages[item][3])}
                                </li>
                            </>
                    }
                })}
                {representativeReplay
                    ?
                    <li className="tag-strip fixed">
                        <div className="action-bar">
                            <p className="parag_16">תיוג הפניה</p>
                            {tagging.map((button, key) => {
                                return (
                                    <button key={key} className="basic-button white-button on-bg" onClick={() => updateTag(button.tagging)}>{button.copy}</button>
                                )
                            })}
                        </div>
                    </li>
                    : null
                }

            </ul >
        </>
    )

}

export default Messages



