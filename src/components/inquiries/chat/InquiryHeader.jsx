import React, { useEffect } from "react";
import { useStore } from "../../../Context/Store";
import Select, { components } from "react-select";



const InquiryHeader = ({ id }) => {
    const {
        tag,
        setTag,
        updateTicketTag,
        currentItem,
        ticketData,
        inquiries,
        sideMenuType,
        setInquiries,

    } = useStore();


    const TagFilters = [
        { value: 'negative', label: 'שלילי' },
        { value: 'neutral', label: 'ניטראלי' },
        { value: 'positive', label: 'חיובי' }
    ]

    const changeTag = (id, setNewTag) => {
        updateTicketTag(id, TagFilters.findIndex(item => item.value === setNewTag.value));
        const selectedIndex = TagFilters.findIndex(item => item.value === setNewTag.value);
        setTag(TagFilters.findIndex(item => item.value === setNewTag.value));

        const updatedInquiries = { ...inquiries };
        const selectedTab = updatedInquiries[Object.keys(updatedInquiries)[sideMenuType]];



        selectedTab.map((item, index) => {

            if (String(item["wp-ticket-id"]) === ticketData['wp-ticket-id']) {
                item['tagging'] = setNewTag.label;
                setInquiries(updatedInquiries);
            }

        })

    }


    return (
        <div className="inquiry__header">
            <div className="inquiry__header-top">
                <p className="head_24">דיווח {currentItem.ticket_id}</p>
                <div className="inquiry__header__action">
                    {tag !== '' && <Select
                        components={{
                            DropdownIndicator: () => null,
                            IndicatorSeparator: () => null,
                        }}
                        //   menuIsOpen={true}
                        className="dark-border"
                        classNamePrefix="filter-dropdown"
                        options={TagFilters}
                        defaultValue={TagFilters[tag]}
                        onChange={(setNewTag) => changeTag(ticketData['wp-ticket-id'], setNewTag)}
                    />}

                    <a href={`https://www.lettersontheway.com/ticket/dashboard/${currentItem.ticket_id}/${currentItem.car_number}`} className="basic-button with-icon export-icon" target="_blank">לצפייה בדיווח</a>
                </div>
            </div>
            <div className="inquiry__header-info">
                <p className="parag_16">מס’ רכב: <span className="light">{currentItem.car_number}</span></p>
                |
                <p className="parag_16">סוג עבירה: <span className="light">{currentItem.violation_name}</span></p>
            </div>


        </div>

    )

}

export default InquiryHeader;