import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { useStore } from "../../Context/Store";
import Select, { components } from "react-select";
import clearX from '../../assets/clear-x.svg';
import Cookies from 'js-cookie';





const FilterModal = ({ firstDate }) => {
    const { exportFilterIsOpen, setExportFilterIsOpen, url } = useStore();
    const [filterType, setFilterType] = useState('');
    const [filterMonths, setFilterMonths] = useState({ start: [], end: [] });
    const [value, setValue] = useState({ default: undefined, selected: undefined });




    const exportFilters = [
        {
            type: 'last-week',
            copy: 'השבוע '
        },
        {
            type: 'last-month',
            copy: 'החודש '
        },
        {
            type: 'last-year',
            copy: 'השנה '
        },
        {
            type: 'date-range',
            copy: 'טווח חודשים'
        }
    ]

    const getMonthsSinceTimestamp = (timestamp) => {
        const startDate = new Date(timestamp);
        const currentDate = new Date();
        const months = [];

        let currentMonth = startDate.getMonth();
        let currentYear = startDate.getFullYear();

        while (currentYear < currentDate.getFullYear() || currentMonth <= currentDate.getMonth()) {
            months.push({
                value: `${getMonthName(currentMonth)}-${currentYear}`,
                label: `${getMonthName(currentMonth, true)} ${currentYear}`,
                // active: true
            });

            currentMonth++;
            if (currentMonth === 12) {
                currentMonth = 0;
                currentYear++;
            }
        }

        setFilterMonths({ start: months, end: months });
        setValue({ default: months[months.length - 1], selected: '' });


    }

    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    const monthsHeb = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסוט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];



    const getMonthName = (monthIndex, heb = false) => {

        if (heb) {
            return monthsHeb[monthIndex];
        } else {
            return months[monthIndex];
        }

    }



    const getDate = (value, start = false, end = false) => {


        const newArray = [];
        let selection = null;

        filterMonths.start.forEach((month, index) => {
            if (month === value) {
                selection = index;
            }
        });



        filterMonths.start.forEach((month, index) => {

            if (selection > index) {
                newArray.push({ ...month, isDisabled: true });
            } else {
                newArray.push(month);
            }


        });

        setFilterMonths(prevStat => ({ start: prevStat.start, end: newArray }));

        if (start) {
            setFilterType(prevState => ({
                dateRange: {
                    start: value.value,
                    end: prevState.dateRange.end
                }
            }))
        }

        if (end) {



            setFilterType(prevState => ({
                dateRange: {
                    start: prevState.dateRange.start,
                    end: value.value
                }
            }))
        }




    }

    useEffect(() => {

        const timestamp = Date.parse(firstDate);


        getMonthsSinceTimestamp(timestamp)



    }, [firstDate]);


    const downloadFile = (url) => {
        // Create a temporary anchor element
        let anchorElement = document.createElement('a');
        anchorElement.href = url;
        let lastSlashIndex = url.lastIndexOf('/');
        let lastDotIndex = url.lastIndexOf('.');
        var fileName = url.substring(lastSlashIndex + 1, lastDotIndex);
        anchorElement.download = fileName;


        // Trigger a click event on the anchor element
        // This will prompt the browser to download the file
        anchorElement.click();
    }


    const getExcelSS = async (query) => {

        try {
            const response = await fetch(`${url}/wp-json/safelane-api/create-excel-file-url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // "authorization": `Bearer ${Cookies.get('authToken')}`,
                },
                credentials: 'include',

                body: JSON.stringify({
                    range: query
                })

            })

            if (response.ok) {
                const data = await response.json();
                downloadFile(data.download_url);
                setExportFilterIsOpen(false)

            } else {
                console.error('Response not OK');
            }


        } catch (error) {
            console.error('Error fetching data:', error);

        }

    }



    return (

        <Modal
            isOpen={exportFilterIsOpen}
            contentLabel="Selected Option"
            ariaHideApp={false}
            portalClassName="chat-modal"
            style={{
                content: {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    outline: 'none',
                    padding: '0',
                    border: 'none',
                    overflow: 'hidden',
                    display: 'flex',
                    background: 'rgba(0, 0, 0, .5)',
                }
            }}
        >
            <div className="filter-modal">
                <button className="close"
                    onClick={() => {
                        setExportFilterIsOpen(false);
                        setFilterType('')
                    }
                    }>

                    <img src={clearX} />
                </button>

                <p className="head_18"><strong>מאיזה טווח תאריכים לייצא?</strong></p>
                {exportFilters.map((filter, key) => {

                    return (
                        <div key={key} className="dropdown__selection">
                            <input
                                name='radioGroup'
                                id={filter.type}
                                type='radio'
                                onClick={(e) => {
                                    e.target.id === 'date-range'
                                        ?
                                        setFilterType({ dateRange: { start: filterMonths.start[filterMonths.start.length - 2].value, end: filterMonths.end[filterMonths.end.length - 1].value } })
                                        :
                                        setFilterType(e.target.id)
                                }}
                            />
                            <label htmlFor={filter.type}>
                                <div className={`dropdown__content`}>
                                    <span className="parag_14_main query"><strong>{filter.copy}</strong></span>
                                </div>
                            </label>
                        </div>
                    )

                })}
                {typeof filterType !== 'string' &&

                    <div className="filter-modal__date-range">
                        <Select
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                            // menuIsOpen={true}
                            className="dark-border"
                            classNamePrefix="filter-dropdown"
                            options={filterMonths.start}
                            defaultValue={filterMonths.start[filterMonths.start.length - 2]}
                            onChange={
                                (e) => {
                                    getDate(e, true);
                                    setValue({ default: e, selected: undefined })

                                }

                            }
                            styles={{
                                borderColor: 'black'

                            }}
                        />
                        <p className="parag_14_main until">עד</p>

                        <Select
                            components={{
                                DropdownIndicator: () => null,
                                IndicatorSeparator: () => null,
                            }}
                            // menuIsOpen={true}
                            className="dark-border"
                            classNamePrefix="filter-dropdown"
                            options={filterMonths.end}
                            value={value.selected ? value.selected : value.default}
                            onChange={(e) => {
                                getDate(e, false, true);
                                setValue(prevStat => ({ default: prevStat.default, selected: e }))


                            }

                            }
                        />

                    </div>
                }
                <button
                    className="basic-button export"
                    disabled={!filterType}
                    onClick={() => getExcelSS(filterType)}
                >ייצוא נתונים</button>
            </div>
        </Modal>


    )
}

export default FilterModal