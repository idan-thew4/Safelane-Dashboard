import React, {  useEffect, useState } from "react";
import InquirySingle from "./Single";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useStore } from "../../context/Store";
import loader from "../../assets/loader.svg";




const List = ({ list }) => {
  const headlines = ['מס’ דיווח', 'מס’ רכב', 'סוג עבירה', 'מועד הפניה', 'זמן המתנה', 'תיוג']
  const [listHeadlines, setListHeadlines] = useState(headlines)
  const tab_headlines = { opened: 'ממתינים למענה', closed: 'ארכיון' }
  const {setSideMenuType, activeItem, setActiveItem, currentItem, getTicketData, ticketData, filterLoader} = useStore();

  const changeHeadline = (e) => {
    setSideMenuType(e)
    if (e === 1) {
      const updatedHeadlines = [...headlines];
      updatedHeadlines[4] = 'הודעה אחרונה';
      setListHeadlines(updatedHeadlines)
    } else {
      setListHeadlines(headlines)
    }
    getTicketData()
  }


// Parse the "inquiry_date" string into a Date object
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('.').map(Number);
    // Months are zero-based in JavaScript Dates, so subtract 1 from the month
    return new Date(year, month - 1, day);
    // console.log(new Date(year, month - 1, day))
  };

  Object.keys(list).map((type, key) => {
    list[type].sort((a, b) => {
      const dateA = parseDate(a.inquiry_date);
      const dateB = parseDate(b.inquiry_date);
      return dateB - dateA;
    });
  })

  useEffect(()=> {

    console.log(filterLoader)

  }, [filterLoader])


  if (filterLoader) {
    return <div className="loader__wrapper filter">
        <img src={loader}/>
    </div>;
}

  return (
    <Tabs direction={'rtl'} onSelect={(e) => changeHeadline(e)} >
      <TabList>
        {Object.keys(list).map((type, key) => {
          return (
            <Tab key={key}>{`${tab_headlines[type]} (${list[type].length})`}</Tab>
          )
        })}
      </TabList>
      {Object.keys(list).map((type, key) => {
        return (
          <TabPanel key={key}>
            <ul className="list-grid header">
              {listHeadlines.map((headline, key) => {
                return (<li className="parag_16 bold" key={key}>{headline}</li>)
              })}
            </ul>
            <ul className={type} style = {{
              overflow: list[type].length > 8 ? "auto" : "hidden",
              overflowX:"hidden"
              }}>
              {list[type].map((item, itemKey) => {
                return (
                  <InquirySingle 
                  key={itemKey} 
                  item={item} 
                  itemKey={itemKey}
                  isActive={ticketData ? activeItem : ''}
                  ></InquirySingle>
                )
              })}
            </ul>
          </TabPanel>
        )
      })}
    </Tabs>
  )



}


export default List;