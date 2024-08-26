import React from 'react';
import WeekdayDateRangePicker from './components/WeekdayDateRangePicker';

const App: React.FC = () => {
  const handleDateRangeChange = (dateRange: [string, string], weekends: string[]) => {
    console.log('Selected Date Range:', dateRange);
    console.log('Weekends within the range:', weekends);
  };

  const predefinedRanges = [
    { label: 'Last 7 Days', range: ['2024-08-19', '2024-08-25'] },
    { label: 'Last 30 Days', range: ['2024-07-27', '2024-08-25'] },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weekday Date Range Picker</h1>
      <WeekdayDateRangePicker onChange={handleDateRangeChange} predefinedRanges={predefinedRanges} />
    </div>
  );
};

export default App;
