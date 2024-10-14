'use client';
import React, { useState, MouseEvent, useEffect } from 'react';
import { Button, Popover, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Iconify } from '../iconify';

// Define the props to include the custom handler
interface DatePickerButtonProps {
  onDateChange?: (startDate: string | null, endDate: string | null) => void; // Custom handler for date changes, formatted as 'YYYY-MM-DD'
}

const DatePickerButton: React.FC<DatePickerButtonProps> = ({ onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
  };

  // Function to update URL with query params using window.history
  const updateUrlWithDates = (start: string, end: string) => {
    const currentUrl = new URL(window.location.href);

    // Set the start_date and end_date query parameters
    currentUrl.searchParams.set('start_date', start);
    currentUrl.searchParams.set('end_date', end);

    // Use the history API to update the URL without reloading
    window.history.pushState({}, '', currentUrl.toString());
  };

  // Function to remove start_date and end_date query params
  const clearDateQueryParams = () => {
    const currentUrl = new URL(window.location.href);

    // Remove the start_date and end_date query parameters
    currentUrl.searchParams.delete('start_date');
    currentUrl.searchParams.delete('end_date');

    // Update the URL without reloading
    window.history.pushState({}, '', currentUrl.toString());

    // Reset the date pickers
    setStartDate(null);
    setEndDate(null);

    // Optionally call the custom handler with null values when clearing the dates
    if (onDateChange) {
      onDateChange(null, null);
    }
  };

  // Update query params and trigger the custom handler when start or end date changes
  useEffect(() => {
    if (startDate && endDate) {
      const formattedStartDate = startDate.format('YYYY-MM-DD');
      const formattedEndDate = endDate.format('YYYY-MM-DD');

      // Update the URL with selected start and end dates
      updateUrlWithDates(formattedStartDate, formattedEndDate);

      // Call the custom handler with formatted dates
      if (onDateChange) {
        onDateChange(formattedStartDate, formattedEndDate); // Pass formatted dates to the handler
      }
    }
  }, [startDate, endDate, onDateChange]);

  // Logic for formatting the button text based on the selected dates
  const getButtonText = () => {
    if (!startDate || !endDate) return 'Select Date Range';

    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();

    const startMonth = startDate.month();
    const startYear = startDate.year();
    const endMonth = endDate.month();
    const endYear = endDate.year();

    const startMonthName = startDate.format('MMMM');
    const endMonthName = endDate.format('MMMM');

    // Case 1: Both dates are in the current month and year
    if (
      startMonth === currentMonth &&
      endMonth === currentMonth &&
      startYear === currentYear &&
      endYear === currentYear
    ) {
      return 'This Month';
    }

    // Case 2: Both dates are in the same month and year (but not the current month)
    if (startMonth === endMonth && startYear === endYear) {
      return `${startMonthName} / ${startYear}`;
    }

    // Case 3: Both dates are in the same year but different months
    if (startYear === endYear) {
      return `Between ${startMonthName}, ${endMonthName}`;
    }

    // Case 4: The dates span different years
    return `Between ${startMonthName} / ${startYear}, ${endMonthName} / ${endYear}`;
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        variant="soft"
        sx={{
          color: '#1C252E',
          fontWeight: 500,
          padding: '0.5rem 1rem',
        }}
        endIcon={<Iconify icon="solar:calendar-mark-bold-duotone" />}
        onClick={handleClick}
      >
        {getButtonText()}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ padding: 2 }}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: false,
                helperText: '',
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={handleEndDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: false,
                helperText: '',
              },
            }}
          />
        </Box>
      </Popover>

      {/* Clear button */}
      <Button
        variant="soft"
        sx={{
          color: '#1C252E',
          fontWeight: 500,
          padding: '0.5rem',
          marginLeft: 2,
        }}
        onClick={clearDateQueryParams}
      >
        <Iconify icon="eva:close-fill" />
      </Button>
    </div>
  );
};

export default DatePickerButton;
