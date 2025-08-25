import React from "react";
import { useMonth, useDatepicker } from "@datepicker-react/hooks";
import Day from "./Day";
import arrow from "../../../../assets/arrow_black.svg";



function Month({ year, month, firstDayOfWeek, goToPreviousMonths, goToNextMonths, monthKey }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek: 0
  });



  const hebrewMonthLabel = new Date(year, month, 1).toLocaleDateString('he-IL', { month: 'long' });
  const hebrewWeekdayLabels = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];



  return (
    <div key={monthKey}>
      <div style={{ textAlign: "center", margin: "0 0 16px", }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            rowGap: '1rem',
            padding: '1rem 1.5rem'

          }}>
          <div>
            <strong className="parag_14_main">{hebrewMonthLabel}</strong>
            <strong className="parag_14_main"> {year}</strong>
          </div>
          <div style={{ display: "flex", }}>
            <button style={{ display: "flex", }} type="button" onClick={goToPreviousMonths}>
              <img src={arrow} />
            </button>
            <button style={{ display: "flex", }} type="button" onClick={goToNextMonths}>
              <img style={{ rotate: '180deg' }} src={arrow} />
            </button>
          </div>
        </div>



      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center",
          fontWeight: '700',
          marginBottom: '2rem',


        }}
      >
        {hebrewWeekdayLabels.map(hebrewDayLabel => (
          <div style={{ textAlign: "center" }} key={hebrewDayLabel}>
            {hebrewDayLabel}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          justifyContent: "center",
          rowGap: "0.5rem"
        }}
      >
        {days.map((day, idx) => {
          // Unique key: use timestamp for real days, fallback for empty cells
          const key = day.date
            ? day.date.getTime()
            : `empty-${year}-${month}-${day.dayLabel}-${idx}`;
          return <Day date={day.date} key={key} day={day.date ? day.date.getDate().toString() : ""} />;
        })}
      </div>
    </div>
  );
}

export default Month;
