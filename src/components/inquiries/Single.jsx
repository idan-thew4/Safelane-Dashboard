import React, { useState } from "react";
import { useStore } from "../../context/Store";
import List from "./List";
import { useStateManager } from "react-select";
import Cookies from 'js-cookie';
import { useNavigate, useRouteLoaderData } from "react-router-dom";



const Single = ({ item, itemKey, isActive, onItemClick }) => {
    // const tagging = ['שלילי', 'ניטראלי', 'חיובי'];
    const {
        getTicketData,
        scrollToBottom,
        setTag,
        active,
        tagging,
        // setTaggingTimeStamp,
        waitingTime,
        setWaitingTime,
        sideMenuType,
        inquiries,
        setInquiries,
        moveToArchive,
        SetCurrentItem,
        setActiveItem,
        markSearchResults,
        setChatLoader,
        url


    } = useStore();
    // const [isActive, setIsActive] = useState();
    const [sideMenu, setSideMenu] = useState(false);
    const [deleteAnimation, SetDeleteAnimation] = useState(false);
    const navigate = useNavigate();





    const getWaitingTime = (startDate) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const formatDate = startDate.split('.');
        const validDate = `20${formatDate[2]}-${formatDate[1]}-${formatDate[0]}`
        const start = new Date(validDate);
        const end = new Date();
        let diffDays = Math.round(Math.abs((start - end) / oneDay));
        let waitingTag = '';


        if (diffDays <= 3) {
            waitingTag = 'green';
        } else if (diffDays > 3 && diffDays <= 5) {
            waitingTag = 'orange';
        } else {
            waitingTag = 'red';
        }
        return <span className={`inquiry__single ${waitingTag}`}>{`${diffDays} ימים`} </span>

    }






    const getChat = async (id, e, itemKey) => {


        if (!e.target.classList.contains('more-button') && !e.target.classList.contains('move-inquiry-button')) {

            setChatLoader(true);




            try {
                const response = await fetch(`${url}/wp-json/safelane-api/get-dashboard-ticket-details?wp-ticket-id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // "authorization": `Bearer ${Cookies.get('authToken')}`,

                    },
                    credentials: 'include',

                });
                if (!response.ok) {
                    navigate(`/login`);
                }
                const data = await response.json();
                getTicketData(data);
                scrollToBottom(500);
                setTag(item.tagging);
                SetCurrentItem(item);
                setChatLoader(false);

                // SetCurrentItem(itemKey);


                //*TODO: Set setTaggingTimeStamp to timeStamp coming from the ticket object// 
                //*TODO: Set setWaitingTime to boolean coming from the ticket object// 
                setActiveItem(itemKey);



            } catch (error) {
                console.error('Error fetching data:', error);
            }

            if (moveToArchive.replayed && moveToArchive.id !== '') {
                if (id !== moveToArchive.id) {
                    moveInquiry(0, inquiries.opened.find(item => item['ticket_id'] === moveToArchive.id), null);
                    console.log(inquiries.opened.find(item => item['ticket_id'] === moveToArchive.id))
                }
            }


        }
    }

    const moveInquiry = async (type, item, e = null) => {

        // alert(e.target)

        if ((e !== null && e.target.classList.contains('move-inquiry-button')) || e === null) {

            setSideMenu(false);
            // SetDeleteAnimation(true)
            const clonedInquiries = [];
            clonedInquiries.opened = inquiries.opened;
            clonedInquiries.closed = inquiries.closed;
            const clonedItem = { ...item };
            let desiredKeyOrder = [];
            let reorderedObject = '';
            let status = '';


            switch (type) {
                case 0:

                    // Remove from opened
                    let updatedOpenedArray = clonedInquiries.opened.filter(obj => obj['ticket_id'] !== item['ticket_id']);
                    clonedInquiries.opened = updatedOpenedArray;

                    //Get today's date;
                    const todayDate = new Date(Date.now());
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                    const formattedDate = todayDate.toLocaleDateString('en-GB', options).replace(/\//g, '.');

                    //Place date in last_message//
                    clonedItem.last_message = formattedDate;

                    //Delete waiting_time//
                    delete clonedItem.waiting_time;

                    //Decide which key order to use and reorder object//
                    desiredKeyOrder = ["ticket_id", "car_numer", "violation_name", "inquiry_date", "last_message", "tagging", "wp-ticket-id"];
                    reorderedObject = Object.fromEntries(
                        desiredKeyOrder.map(key => [key, clonedItem[key]])
                    );

                    //Add to Closed//
                    clonedInquiries.closed.unshift(reorderedObject);

                    status = 'closed'

                    break;

                case 1:

                    // Remove from closed
                    let updatedClosedArray = clonedInquiries.closed.filter(obj => obj['ticket_id'] !== item['ticket_id']);
                    clonedInquiries.closed = updatedClosedArray;

                    //Add waiting_time//
                    clonedItem.waiting_time = '';

                    //Delete last_message//
                    delete clonedItem.last_message;

                    //Decide which key order to use and reorder object//
                    desiredKeyOrder = ["ticket_id", "car_numer", "violation_name", "inquiry_date", "waiting_time", "tagging", "wp-ticket-id"];
                    reorderedObject = Object.fromEntries(
                        desiredKeyOrder.map(key => [key, clonedItem[key]])
                    );

                    //Add to Opened//
                    clonedInquiries.opened.unshift(reorderedObject);

                    status = 'opened'

            }





            setTimeout(() => {
                setInquiries(clonedInquiries);
                // SetDeleteAnimation(false)

            }, "500");





            try {
                const response = await fetch(`${url}/wp-json/safelane-api/update-ticket-status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // "authorization": `Bearer ${Cookies.get('authToken')}`,
                    },
                    credentials: 'include',

                    body: JSON.stringify({
                        "wp-ticket-id": reorderedObject['wp-ticket-id'],
                        "status": status
                    })

                })
                if (!response.ok) {
                    navigate(`/login`);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }


        }
    }




    const getMarkedSearchedResults = (searchItem, searchKey) => {

        let regex = new RegExp(searchKey, "g");
        let result = searchItem.replace(regex, '<span class="search-keys">$&</span>');
        return <span dangerouslySetInnerHTML={{ __html: result }} />;

    }












    return (
        <li key={itemKey} onClick={(e) => getChat(item['wp-ticket-id'], e, itemKey)} >
            <ul ref={isActive === itemKey ? active : null} className={`list-grid ${isActive === itemKey ? 'active' : ''} ${deleteAnimation ? 'animate-delete' : ''}`}>
                {Object.keys(item).map((tab, tabKey) => {
                    if (tab !== 'wp-ticket-id') {
                        return (
                            <li key={tabKey} className={`parag_16 ${tab}`}>
                                {tab === 'tagging' && tagging[item[tab]]
                                    ?
                                    tagging[item[tab]].copy
                                    :
                                    tab === 'ticket_id' || tab === 'car_number' || tab === 'violation_name'
                                        &&
                                        markSearchResults
                                        ?
                                        getMarkedSearchedResults(item[tab], markSearchResults)
                                        :
                                        item[tab]}

                                {tab === 'waiting_time' ? waitingTime ? getWaitingTime(item.inquiry_date) : null : null}
                            </li>
                        )
                    }
                })}
                <li className="more">
                    <button
                        className="more-button"
                        onClick={() => setSideMenu(prevState => !prevState)}
                    ></button>
                    <button className={`move-inquiry-button parag_14 ${sideMenuType === 0 ? 'move-to-archive' : 'back-to-opened'} ${sideMenu && 'active'}`}
                        onClick={(e) => moveInquiry(sideMenuType, item, e)}
                        onMouseOut={() => setSideMenu(false)}
                    >העברה ל{sideMenuType === 0 ? 'ארכיון' : 'ממתינים למענה'}

                    </button>
                </li>
            </ul>
        </li>
    )

}

export default Single
