import React, { useRef, useContext, useEffect } from "react";
import { useDay } from "@datepicker-react/hooks";
import DatepickerContext from "./datepickerContext";

function Day({ day, date, index }) {
  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateSelect,
    onDateFocus,
    onDateHover
  } = useContext(DatepickerContext);
  const {
    isSelected,
    isSelectedStartOrEnd,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef
  });

  let selected = 0;

  const countSelected = () => {
    if (isSelected) {
      selected++
    }

  }



  if (!day) {
    return <div />;
  }

  return (
    <button className={`${isSelectedStartOrEnd ? 'cal-selected' : ''}`}
      key={day}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type="button"
      ref={dayRef}
      style={{
        color: isSelected || isSelectedStartOrEnd ? "white" : "black",
        background: isSelected || isSelectedStartOrEnd ? "#444FB2" : "transparent",
        padding: '0.5rem',
        // borderRadius: isSelectedStartOrEnd ? '10rem 10rem 10rem 10rem' : '0', // Apply round border radius to first and last selected dates

      }}
    >
      {day}
    </button>
  );
}

export default Day;
