
import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import { useStore } from "../../context/Store";
import Select, { components } from "react-select";
import clearX from '../../assets/clear-x.svg';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import heLocale from 'date-fns/locale/he';
import arrow from '../../assets/arrow_black.svg';








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
        setFilterType({ dateRange: { start: `${getMonthName(startDate.getMonth())}-${startDate.getFullYear()}`, end: `${getMonthName(currentDate.getMonth())}-${currentDate.getFullYear()}` } });


    }

    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

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

    useEffect(() => {

        console.log('filterType changed:', filterType);


    }, [filterType])


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

    console.log('months:', filterMonths);


    return (

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={heLocale}>
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
                            // setFilterType('')
                        }
                        }>

                        <img src={clearX} />
                    </button>

                    <p className="head_18"><strong>מאיזה טווח תאריכים לייצא?</strong></p>
                    {exportFilters.map((filter, key) => {

                        if (filter.type === 'date-range' && filterMonths.start.length < 2) {
                            return null;
                        }

                        return (
                            <div key={key} className="dropdown__selection">
                                <input
                                    checked={filter.type === (typeof filterType === 'string' ? filterType : 'date-range')}
                                    name='radioGroup'
                                    id={filter.type}
                                    type='radio'
                                    onChange={(e) => {
                                        if (e.target.id === 'date-range') {
                                            // Start: always '1-2024'
                                            const start = '1-2024';
                                            // End: current month and year
                                            const now = new Date();
                                            const end = `${now.getMonth() + 1}-${now.getFullYear()}`;
                                            setFilterType({ dateRange: { start, end } });
                                        } else {
                                            setFilterType(e.target.id);
                                        }
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
                    {/* {typeof filterType !== 'string' && */}
                    <div className="filter-modal__date-range">
                        <DatePicker
                            views={["year", "month"]}
                            // minDate={new Date('2024-01-01')}
                            maxDate={new Date()}
                            shouldDisableYear={(year) => year.getFullYear() < 2024}
                            value={value.selected && value.selected[0] instanceof Date ? value.selected[0] : new Date('2024-01-01')}
                            onChange={(newValue) => {
                                // Always store Date objects in value.selected
                                const end = value.selected ? value.selected[1] : (filterType.dateRange ? filterType.dateRange.end : null);
                                setValue({ ...value, selected: [newValue, end] });
                                // Format for filterType only
                                let result = '';
                                if (newValue instanceof Date && !isNaN(newValue)) {
                                    const month = newValue.getMonth() + 1;
                                    const year = newValue.getFullYear();
                                    result = `${month}-${year}`;
                                }
                                setFilterType(prev => ({ dateRange: { start: result, end: prev.dateRange ? prev.dateRange.end : null } }));
                            }}
                            renderInput={(params) => <input {...params} className="dark-border" />}
                            slotProps={{ textField: { placeholder: 'בחר חודש ושנה' } }}
                            className="dark-border filter-dropdown"
                            slots={{
                                openPickerIcon: () => <img className="arrow-icon" src={arrow} alt="arrow-icon" style={{ width: 10, height: 10 }} />
                            }}
                        />
                        <span className="parag_14_main until">עד</span>
                        <DatePicker
                            // format="MM/yyyy"
                            views={["year", "month"]}
                            // minDate={new Date('2024-01-01')}
                            maxDate={new Date()}
                            shouldDisableYear={(year) => year.getFullYear() < 2024}
                            value={value.selected && value.selected[1] instanceof Date ? value.selected[1] : new Date()}
                            minDate={value.selected && value.selected[0] instanceof Date ? value.selected[0] : new Date('2024-01-01')}
                            onChange={(newValue) => {
                                // Always store Date objects in value.selected
                                const start = value.selected ? value.selected[0] : (filterType.dateRange ? filterType.dateRange.start : null);
                                setValue({ ...value, selected: [start, newValue] });
                                // Format for filterType only
                                let result = '';
                                if (newValue instanceof Date && !isNaN(newValue)) {
                                    const month = newValue.getMonth() + 1;
                                    const year = newValue.getFullYear();
                                    result = `${month}-${year}`;
                                }
                                setFilterType(prev => ({ dateRange: { start: prev.dateRange ? prev.dateRange.start : null, end: result } }));
                            }}
                            renderInput={(params) => <input {...params} className="dark-border" />}
                            slotProps={{ textField: { placeholder: 'בחר חודש ושנה' } }}
                            className="dark-border filter-dropdown"
                            slots={{
                                openPickerIcon: () => <img className="arrow-icon" src={arrow} alt="arrow-icon" style={{ width: 10, height: 10 }} />
                            }}
                        />
                    </div>
                    {/* } */}
                    <button
                        className="basic-button export"
                        disabled={!filterType}
                        onClick={() => getExcelSS(filterType)}
                    >ייצוא נתונים</button>
                </div>
            </Modal>
        </LocalizationProvider>


    )
}

export default FilterModal