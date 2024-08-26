import React, { useState } from 'react';

type DateRangePickerProps = {
  onChange: (dateRange: [string, string], weekends: string[]) => void;
  predefinedRanges?: { label: string; range: [string, string] }[];
};

const WeekdayDateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, predefinedRanges }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Format date to 'YYYY-MM-DD'
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date is selected within the current range
  const isSelected = (date: Date): boolean => {
    const formattedDate = formatDate(date);
    return startDate !== null && endDate !== null
      ? formattedDate >= startDate && formattedDate <= endDate
      : formattedDate === startDate;
  };

   // Handle date selection logic
  const handleDateSelect = (date: Date) => {
    const formattedDate = formatDate(date);
    if (startDate === null || endDate !== null) {
      setStartDate(formattedDate);
      setEndDate(null);
    } else {
      // Ensure the end date is after the start date
      if (new Date(formattedDate) >= new Date(startDate)) {
        setEndDate(formattedDate);
        handleDateChange(startDate, formattedDate);
      } else {
        setStartDate(formattedDate);
        setEndDate(null);
      }
    }
  };

  // Handle the change event and calculate weekends within the range
 const handleDateChange = (start: string, end: string) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const weekends: string[] = [];

    // Add one day to start and end dates
    startDateObj.setDate(startDateObj.getDate() + 1);
    endDateObj.setDate(endDateObj.getDate() + 1);

    // Format the adjusted dates
    const adjustedStart = formatDate(startDateObj);
    const adjustedEnd = formatDate(endDateObj);

    for (let date = new Date(startDateObj); date <= endDateObj; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(formatDate(date));
      }
    }

    onChange([adjustedStart, adjustedEnd], weekends);
};


  
  // Render the calendar UI, excluding weekends
  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weeks: JSX.Element[] = [];
    let days: JSX.Element[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dayOfWeek = date.getDay();

      // Exclude weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(
          <button
            key={i}
            onClick={() => handleDateSelect(date)}
            style={{
              backgroundColor: isSelected(date) ? 'lightblue' : 'transparent',
              margin: '2px',
              padding: '5px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            {i}
          </button>
        );
      } else {
        days.push(<div key={i} style={{ opacity: 0.5, margin: '2px', padding: '5px 10px' }}>{i}</div>);
      }

      // Break week
      if (dayOfWeek === 5 || i === daysInMonth) {
        weeks.push(<div key={i} style={{ display: 'flex' }}>{days}</div>);
        days = [];
      }
    }
    return weeks;
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', width: '300px' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setCurrentYear(currentYear - 1)}>Previous Year</button>
        <span style={{ margin: '0 10px' }}>{currentYear}</span>
        <button onClick={() => setCurrentYear(currentYear + 1)}>Next Year</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1)}>Previous Month</button>
        <span style={{ margin: '0 10px' }}>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })}</span>
        <button onClick={() => setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1)}>Next Month</button>
      </div>
      <div>
        {renderCalendar()}
      </div>
      <div style={{ marginTop: '10px' }}>
        {predefinedRanges && predefinedRanges.map((range, index) => (
          <button key={index} onClick={() => {
            setStartDate(range.range[0]);
            setEndDate(range.range[1]);
            handleDateChange(range.range[0], range.range[1]);
          }}>
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekdayDateRangePicker;
