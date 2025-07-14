import React, { useState, useRef, useEffect } from "react"; // Import React
import { useStore } from "../../../Context/Store";
import Datepicker from "../../inquiries/Menu/datepicker/Datepicker";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";








const Filter = ({ type, copy }) => {
  const {
    getChecked,
    activeFilter,
    setActiveFilter,
    inquiriesFilter,
    getQueriedData,
    redirectsToLogin,
    url
  } = useStore();
  const [options, setOptions] = useState();
  const datePickerRef = useRef();
  const [checkedFilters, setCheckedFilters] = useState(false);
  const [filtersCopy, setFiltersCopy] = useState();
  const [selectedFiltersCount, setSelectedFiltersCount] = useState();
  const [datePickerStatus, setDatePickerStatus] = useState(false);
  const checkboxRefs = useRef([]);






  const copyArray = [
    {
      name: 'referral-date',
      copy: {
        lastWeek: 'השבוע',
        lastMonth: 'החודש',
      }
    },
    {
      name: 'waiting-time',
      copy: {
        moreThanfiveDays: 'מעל 5 ימים',
        threeToFourDays: '3-4 ימים',
        upToTwoDays: 'עד יומיים'
      }
    }
  ]



  const getFilters = async (api) => {
    try {
      const response = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "authorization": `Bearer ${Cookies.get('authToken')}`,
        },
      });
      if (!response.ok) {
        redirectsToLogin();
      }
      const data = response.json();
      return data


    } catch (error) {
      console.error('Error fetching data:', error);

    }
  }

  useEffect(() => {


    getFilters(`${url}/wp-json/safelane-api/get-violations-list-and-counts`).then((result) => {

      switch (type) {

        case 'referral-date':
          setOptions(result.referralDate);
          setFiltersCopy(copyArray[0].copy);

          break;
        case 'inquiry-type':
          setOptions(result.inqueryType);

          break;
        case 'waiting-time':
          setOptions(result.waitingTime);
          setFiltersCopy(copyArray[1].copy);

      }

    });

  }, [type])

  useEffect(() => {

    switch (type) {
      case 'referral-date':
        setSelectedFiltersCount(inquiriesFilter.duration !== '' ? 1 : 0);
        break;
      case 'inquiry-type':
        setSelectedFiltersCount(inquiriesFilter.type.length);
        break;
      case 'waiting-time':
        setSelectedFiltersCount(inquiriesFilter.waiting_time.length);
    }



  }, [inquiriesFilter])


  const resetQuery = () => {

    Object.keys(checkboxRefs).forEach((ref) => {
      if (checkboxRefs[ref].current) {
        checkboxRefs[ref].current.checked = false
      }
    })

    if (datePickerStatus) {
      datePickerRef.current.checked = false
    }
    getChecked('clear', type);
    setSelectedFiltersCount(0);
    setDatePickerStatus(false);
  };






  return (
    <div className="dropdown">
      <div className={`dropdown__filter-count ${selectedFiltersCount > 0 ? 'selected' : ''}`}>
        {selectedFiltersCount > 0 ? selectedFiltersCount : null}
      </div>
      <div className="dropdown__filters-count"></div>
      <button
        className={`basic-button white-button dropdown-button ${activeFilter === type ? 'active' : ''} ${selectedFiltersCount > 0 ? 'selected' : ''}`}
        onClick={() => setActiveFilter(type)}>{copy}</button>
      <div
        className={`filter-dropdown__menu inquiry-filter ${activeFilter === type ? 'open' : ''} ${type}`}
      >
        {options
          ?
          Object.keys(options).map((option, key) => {
            checkboxRefs[key] = React.createRef()
            return (
              <div key={key} className={`dropdown__selection ${type} ${type === 'inquiry-type' ? options[option].count === 0 ? 'disabled' : '' : options[option] === 0 ? 'disabled' : ''}`}>
                <input
                  name={type === 'referral-date' ? 'radioGroup' : null}
                  id={type === 'inquiry-type' ? options[key].id : option}
                  type={type === 'referral-date' ? 'radio' : 'checkbox'}
                  onClick={(e) => { getChecked(e, type), setDatePickerStatus(false) }}
                  ref={checkboxRefs[key]}
                  disabled={type === 'inquiry-type' ? options[option].count === 0 ? true : false : options[option] === 0 ? true : false}
                />

                <label className={type === 'inquiry-type' ? options[key].id : option} htmlFor={type === 'inquiry-type' ? options[key].id : option}>
                  <div className={`dropdown__content`}>
                    <span className="parag_14 query">{type === 'inquiry-type' ? options[key].name : filtersCopy[option]}</span>
                    <span className="parag_12 count">{type === 'inquiry-type' ? options[key].count : options[option]}</span>
                  </div>
                </label>
              </div>
            )
          }) : null
        }
        {type === 'referral-date' &&
          <div className={`dropdown__selection ${type}`}>
            <input
              name='radioGroup'
              id='datePicker'
              type='radio'
              onClick={
                () => { setDatePickerStatus(true); setSelectedFiltersCount(1) }}
              ref={datePickerRef}

            />
            <label htmlFor='datePicker'>
              {/* <div className={`dropdown__content`}> */}
              <span className="parag_14 query">טווח תאריכים</span>
              {datePickerStatus && <Datepicker />}
              {/* </div> */}
            </label>
          </div>
        }
        <div className="dropdown__buttons">
          <button
            className="basic-button"
            onClick={() => { getQueriedData(), setActiveFilter() }}>סינון
          </button>
          <button
            className={`basic-button white-button on-bg ${selectedFiltersCount > 0 ? '' : 'disabled'}`}
            onClick={() => { resetQuery(); setActiveFilter() }}
          >איפוס
          </button>
        </div>
      </div>

    </div>

  );

}



export default Filter

