import React, { useContext, createContext, useState, useRef, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";




// Import createContext and initialize it
const ApiContext = createContext([]);

function useStore() {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useStore should be used within ApiContext only');
    }
    return context;
}


const months = {
    jan: 'ינואר',
    feb: 'פברואר',
    mar: 'מרץ',
    apr: 'אפריל',
    may: 'מאי',
    jun: 'יוני',
    jul: 'יולי',
    aug: 'אוגוסוט',
    sep: 'ספטמבר',
    oct: 'אוקטובר',
    nov: 'נובמבר',
    dec: 'דצמבר'
}

const days = {
    "sun": 'ראשון', //minutes
    "mon": 'שני',
    "tue": 'שלישי',
    "wed": 'רביעי',
    "thu": 'חמישי',
    "fri": 'שישי',
    "sat": 'שבת',


}

const users = {
    letters: 'מכתבים',
    clipViewers: 'צופים בסרטון',
    inquiries: 'פניות',
    leftDetails: 'השאירו פרטים',
    proceededToSite: 'עברו לאתר',
    proceededToApp: 'עברו לאפליקציה',
}



//Wrap child components in the Context Provider and supply the state value.
const Store = ({ children }) => {


    const redirectsToLogin = () => {
        Cookies.remove('authToken');
        Cookies.remove('safelane-user');
        navigate(`/login`);
    }



    //Dashboard
    const [exportFilterIsOpen, setExportFilterIsOpen] = useState(false);

    const getData = async () => {
        try {
            const response = await fetch(`${url}/wp-json/safelane-api/get-dashboard-data`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${Cookies.get('authToken')}`,

                },

            });

            if (!response.ok) {
                Cookies.remove('authToken');
                Cookies.remove('safelane-user');
                navigate(`/login`);
            }


            const data = response.json();
            return data
        } catch (error) {
            console.error('Error fetching data:', error);
            navigate(`/login`);


        }

    }

    const filters = [
        { value: 'yearly', label: 'השנה' },
        { value: 'monthly', label: 'החודש' },
        { value: 'daily', label: 'השבוע' }
    ]

    const getformatData = (range, type) => {

        const dataArray = [];

        if (type === 'one-param') {
            Object.keys(range.data).forEach((key) => {
                dataArray.push({ name: `${key}`, value: range.data[key] })
            })
        } else if (type === 'two-param') {
            Object.keys(range.inquiries).forEach((key) => {
                dataArray.push({ name: `${key}`, value1: range.inquiries[key] })
            })
            Object.keys(range.letters).forEach((key, index) => {
                dataArray[index].value2 = range.letters[key]
            })


        } else if (type === 'one-param-no-filter') {
            Object.keys(range).forEach((key) => {
                dataArray.push({ name: `${key}`, value: range[key] })
            })
        }



        return dataArray;
    }

    const getDaysAndHours = (minutes) => {

        let days = minutes / (60 * 24);
        let remainingHours = Math.floor((days - Math.floor(days)) * 24);
        days = Math.floor(days);

        if (days > 0) {
            if (days === 1) {
                days = 'יום אחד';
            } else if (days === 2) {
                days = 'יומיים';
            } else {
                days = `${days} ימים`;
            }
        } else {
            days = false;
        }

        if (remainingHours > 0) {
            if (remainingHours === 1) {
                remainingHours = 'שעה';
            } else if (remainingHours === 2) {
                remainingHours = 'שעתיים';
            } else {
                remainingHours = `${remainingHours} שעות`;
            }
        } else {
            remainingHours = 'פחות משעה';
        }

        if (!days) {
            return remainingHours;
        } else {
            return `${days} ו-${remainingHours}`
        }

    }

    const setUserChoice = (data, filterChoice, type) => {

        switch (filterChoice) {
            case 'yearly':
                return getformatData(data.yearly, type);
                break;
            case 'monthly':
                return getformatData(data.monthly, type);
                break;
            case 'daily':
                return getformatData(data.daily, type);
        }
    }

    //Inquiries
    const [inquiries, setInquiries] = useState();
    const [inquiriesFilter, setInquiriesFilter] = useState(
        {
            search: '',
            duration: '',
            type: [],
            waiting_time: []
        }
    );
    const [ticketData, getTicketData] = useState();
    const messagesContainer = useRef();
    const [messages, setMessages] = useState({});
    const [tag, setTag] = useState();
    const [updateCurrentTag, setUpdateCurrentTag] = useState({ currentTag: '', activeItem: '' });
    const active = useRef();
    const [taggingTimeStamp, setTaggingTimeStamp] = useState();
    const [waitingTime, setWaitingTime] = useState(true);
    const [sideMenuType, setSideMenuType] = useState(0);
    const [moveToArchive, setMoveToArchive] = useState({ replayed: false, id: '' })
    const [currentItem, SetCurrentItem] = useState();
    const [activeItem, setActiveItem] = useState();
    const [activeFilter, setActiveFilter] = useState();
    const [clearSelection, setClearSelection] = useState(false);
    const [markSearchResults, setMarkSearchResults] = useState(false);
    const navigate = useNavigate();
    const [chatLoader, setChatLoader] = useState(false);
    const [filterLoader, setFilterLoader] = useState(false);



    const tagging = [{
        tagging: 0,
        copy: 'שלילי'
    }, {
        tagging: 1,
        copy: 'ניטראלי'

    }, {
        tagging: 2,
        copy: 'חיובי'

    }];


    const url = 'https://wordpress-1308208-5685135.cloudwaysapps.com/';
    // const url = 'https://cms.lettersontheway.com';




    const getInquiries = async () => {

        const token = Cookies.get('authToken');


        try {
            const response = await fetch(`${url}/wp-json/safelane-api/get-initial-tickets-list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${Cookies.get('authToken')}`,
                },

            });


            if (!response.ok) {
                redirectsToLogin();
            }
            const data = await response.json();

            return data


        } catch (error) {
            console.error('Error fetching data:', error);


        }

    }

    const scrollToBottom = (time) => {
        if (messagesContainer) {
            setTimeout(() => {
                const getScrollHeight = messagesContainer.current.scrollHeight;
                messagesContainer.current.scrollTo({ top: getScrollHeight, behavior: "smooth" });
            }, time)
        }
    }

    const sendChatMessage = async (messages) => {

        try {

            const response = await fetch(`${url}/wp-json/safelane-api/dashboard-save-chat-to-server`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${Cookies.get('authToken')}`,
                },
                body: "" + JSON.stringify(messages)

            });
            const data = await response.json();

            if (!response.ok) {
                redirectsToLogin();
            }
            // console.log(data)
            // setChat({ ...data.chat })
        } catch (error) {
            console.error('Error fetching data:', error);
            navigate(`/login`);


        }
    }

    const updateTicketTag = async (id, tag) => {

        try {
            const response = await fetch(`${url}/wp-json/safelane-api/update-ticket-tag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${Cookies.get('authToken')}`,
                },
                body: JSON.stringify({
                    "wp-ticket-id": id,
                    "user-tag-id": tag
                })

            });
            if (!response.ok) {
                redirectsToLogin();
            }
        } catch (error) {
            console.error('Error fetching data:', error);


        }

    }

    const [query, setQuery] = useState({
        type: [],
        waiting_time: []

    })



    const getChecked = (selection, type, e) => {
        const selectedFilters = { ...inquiriesFilter };

        if (selection !== 'clear') {

            // console.log(selection)


            switch (type) {
                case 'search':
                    e.preventDefault();
                    selectedFilters.search = selection;
                    getQueriedData(selectedFilters)
                    break;
                default:

                    let selectedFilter = ''

                    if (!selection.target) {
                        selectedFilter = selection
                        console.log(true)
                    } else {
                        selectedFilter = selection.target.id;
                    }
                    switch (type) {
                        case 'referral-date':
                            selectedFilters.duration = selectedFilter;
                            break;
                        default:
                            switch (type) {
                                case 'inquiry-type':

                                    if (selection.target && selection.target.checked) {
                                        query.type.push(Number(selectedFilter));
                                    } else {
                                        let index = query.type.indexOf(selectedFilter);
                                        query.type.splice(index, 1);
                                    }
                                    selectedFilters.type = query.type;


                                    break;
                                case 'waiting-time':
                                    if (selection.target && selection.target.checked) {
                                        query.waiting_time.push(selectedFilter);
                                    } else {
                                        let index = query.waiting_time.indexOf(selectedFilter);
                                        query.waiting_time.splice(index, 1);
                                    }
                                    selectedFilters.waiting_time = query.waiting_time;



                            }
                    }

            }
            setInquiriesFilter(prevFilter => selectedFilters);

        } else {
            switch (type) {
                case 'referral-date':
                    selectedFilters.duration = '';
                    break;
                case 'inquiry-type':
                    selectedFilters.type = [];
                    setQuery(prevQuery => ({ ...prevQuery, type: [] }))
                    break;
                case 'waiting-time':
                    selectedFilters.waiting_time = [];
                    setQuery(prevQuery => ({ ...prevQuery, waiting_time: [] }))
            }
            setInquiriesFilter(prevFilter => selectedFilters);
            setClearSelection(true);


        }

    }

    useEffect(() => {

        if (clearSelection) {
            getQueriedData();
            setClearSelection(false);

        }

    }, [clearSelection])

    const updateChat = (replay, sentEmail = true) => {

        if (active.current.querySelector('li.waiting_time')) {
            active.current.querySelector('li.waiting_time').classList.add('animate-out');
        }

        setMoveToArchive({ replayed: true, id: currentItem.ticket_id });

        let replayKey = '';
        let replayData = '';

        if (typeof replay === 'number') {
            replayKey = `tag-strip_${Date.now()}`;
            replayData = [Date.now(), replay, 'tag-strip'];


        } else {
            replayKey = `admin_${Date.now()}`;
            replayData = [Date.now(), replay];

        }





        //Update Messages setter 
        const updatedMessages = { ...messages, [replayKey]: replayData };

        console.log(updatedMessages)


        scrollToBottom(500);
        setMessages(updatedMessages);

        // Send updated messages 
        sendChatMessage({
            ticket_id: ticketData['ticket_id'],
            time_stamp: Date.now(),
            data: updatedMessages,
            waiting_time: false,
            tagging_timestamp: taggingTimeStamp,
            sentEmail: sentEmail
        })





    }







    const getQueriedData = async (searchKey = false) => {

        setFilterLoader(true);
        console.log('qureied')


        try {

            let finalQuery = '';

            if (searchKey) {
                finalQuery = { ...searchKey };
            } else {
                finalQuery = { ...inquiriesFilter };
            }

            const response = await fetch(`${url}/wp-json/safelane-api/dashboard-apply-filters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": `Bearer ${Cookies.get('authToken')}`,
                },
                body: JSON.stringify({ "data": { ...finalQuery } })
            });

            if (response.ok) {
                setFilterLoader(false)
                const responseData = await response.json();
                setInquiries(responseData); // Extracted response data
                if (searchKey && searchKey.search !== '') {
                    setMarkSearchResults(searchKey.search)
                }
                getTicketData()

            } else {
                console.error('Error:', response.status, response.statusText);
                redirectsToLogin();
            }


        } catch (error) {
            console.error('Error fetching data:', error); 0
        }

    };




    return (
        <ApiContext.Provider value={{
            months,
            days,
            users,
            filters,
            getformatData,
            getDaysAndHours,
            setUserChoice,
            getInquiries,
            inquiries,
            setInquiries,
            getData,
            inquiriesFilter,
            setInquiriesFilter,
            ticketData,
            getTicketData,
            messagesContainer,
            messages,
            setMessages,
            scrollToBottom,
            sendChatMessage,
            tag,
            setTag,
            active,
            tagging,
            updateTicketTag,
            waitingTime,
            setWaitingTime,
            sideMenuType,
            setSideMenuType,
            moveToArchive,
            setMoveToArchive,
            currentItem,
            SetCurrentItem,
            activeItem,
            setActiveItem,
            updateCurrentTag,
            setUpdateCurrentTag,
            getChecked,
            activeFilter,
            setActiveFilter,
            getQueriedData,
            markSearchResults,
            setMarkSearchResults,
            updateChat,
            redirectsToLogin,
            chatLoader,
            setChatLoader,
            filterLoader,
            exportFilterIsOpen,
            setExportFilterIsOpen,
            url

        }}>
            {children}
        </ApiContext.Provider>
    )


}





export { Store, useStore };


