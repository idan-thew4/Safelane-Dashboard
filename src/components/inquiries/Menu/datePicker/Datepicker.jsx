import React, { useEffect, useState } from "react";
import { useDatepicker, START_DATE } from "@datepicker-react/hooks";
import Month from "./Month";
import DatepickerContext from "./datepickerContext";
import { useStore } from "../../../../Context/Store";

function Datepicker() {

    const { getChecked } = useStore();

    const today = new Date();
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [state, setState] = useState({
        startDate: null,
        endDate: null,
        focusedInput: START_DATE
    });

    console.log(state);


    const {
        firstDayOfWeek,
        activeMonths,
        isDateSelected,
        isDateHovered,
        isFirstOrLastSelectedDate,
        isDateBlocked,
        isDateFocused,
        focusedDate,
        onDateHover,
        onDateSelect,
        onDateFocus,
        goToPreviousMonths,
        goToNextMonths
    } = useDatepicker({
        startDate: state.startDate,
        endDate: state.endDate,
        focusedInput: state.focusedInput,
        onDatesChange: handleDateChange,
        numberOfMonths: 1
    });

    function handleDateChange(data) {
        if (!data.focusedInput) {
            setState({ ...data, focusedInput: START_DATE });
        } else {
            setState(data);
        }
    }

    useEffect(() => {

        if (state.startDate !== null || state.endDate !== null) {
            const startDate = state.startDate && state.startDate
            const endDate = state.endDate && state.endDate
            const range = [new Date(endDate).getTime(), new Date(startDate).getTime()]
            // const range = `${startDate !== null ? .getTime() : ''}${startDate && endDate ? ' - ' : ''}${endDate !== null ? new Date(endDate).getTime() : ''}`;
            getChecked(range, 'referral-date');
        }




    }, [state])

    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };



    return (
        <DatepickerContext.Provider
            value={{
                focusedDate,
                isDateFocused,
                isDateSelected,
                isDateHovered,
                isDateBlocked,
                isFirstOrLastSelectedDate,
                onDateSelect,
                onDateFocus,
                onDateHover
            }}
        >

            <div className="date-picker__wrapper parag_14_main">
                <div className="date-picker__selected"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.6rem 1fr",
                        justifyContent: 'space-between',
                        gridGap: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <div className={`date-picker__frame selected`}>
                        {state.startDate !==  null ? state.startDate.toLocaleDateString('en-GB', options) : 'תאריך התחלה'}
                    </div>
                    <p>עד</p>
                    <div  className={`date-picker__frame selected`}>
                        {state.endDate !==  null ?  state.endDate.toLocaleDateString('en-GB', options) : 'תאריך סיום'}
                    </div>
                </div>

                {/* <button type="button" onClick={goToPreviousMonths}>
                {"<"}
            </button>
            <button type="button" onClick={goToNextMonths}>
                {">"}
            </button> */}

                <div className="date-picker__frame"
                    style={{
                        // display: "grid",
                        // margin: "32px 0 0",
                        // gridTemplateColumns: `repeat(${activeMonths.length}, 100%)`,
                        // gridGap: "0 64px"
                        width: '100%'
                    }}
                >
                    {activeMonths.map(month => (
                        <Month
                            key={`${month.year}-${month.month}`}
                            monthKey={`${month.year}-${month.month}`}
                            year={month.year}
                            month={month.month}
                            firstDayOfWeek={firstDayOfWeek}
                            goToPreviousMonths={goToPreviousMonths}
                            goToNextMonths={goToNextMonths}
                        />
                    ))}
                </div>
            </div>
        </DatepickerContext.Provider>
    );
}

export default Datepicker;