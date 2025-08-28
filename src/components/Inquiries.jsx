import React, { useEffect, useState } from "react";
import { useStore } from "../Context/Store";
import InquiriesList from "./inquiries/List";
import Search from "./inquiries/Menu/Search";
import Chat from "./inquiries/Chat";
import Filter from "./inquiries/Menu/filter";
import loader from "../assets/loader.svg";



const Inquiries = () => {
    const {
        getInquiries,
        inquiries,
        setInquiries,
        activeFilter,
        dashboardLoader
    } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const filters = [
        {
            type: 'referral-date',
            copy: 'מועד הפניה'
        },
        {
            type: 'inquiry-type',
            copy: 'סוג העבירה'
        },
        {
            type: 'waiting-time',
            copy: 'זמן פניה'
        }
    ]


    useEffect(() => {
        getInquiries()
            .then((result) => {
                setInquiries(result);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);



    if (isLoading || dashboardLoader) {
        return <div className="loader__wrapper full-screen">
            <img src={loader} />
        </div>;
    }


    return (
        <div className="inquiries__container">
            <div className="inquiries__grid">
                <div className="inquiries__list">

                    <div className="inquiries__menu">
                        <Search />
                        <div className="inquiries__filters">
                            {filters.map((filter, key) => (
                                <Filter
                                    key={key}
                                    type={filter.type}
                                    copy={filter.copy}
                                    active={activeFilter}
                                />
                            ))}

                        </div>

                    </div>
                    <InquiriesList list={inquiries} />
                </div>
                <div className="inquiry__chat">
                    <Chat />
                </div>
            </div>

        </div>
    )




}


export default Inquiries;