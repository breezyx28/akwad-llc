// components/DatePickerButton.tsx

import React, { useState, MouseEvent } from 'react';
import { Button, Popover, Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Iconify } from '../iconify';

const DatePickerButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    handleClose();
  };

  const open = Boolean(anchorEl);

  // Check if the selected date is in the current month and year
  const isCurrentMonth = selectedDate?.isSame(dayjs(), 'month');

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
        {isCurrentMonth ? 'This month' : selectedDate?.format('MMMM YYYY') || 'Select Month'}
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
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                error: false, // You can manage error state if needed
                helperText: '', // Optional: customize if you have error messages
              },
            }}
          />
        </Box>
      </Popover>
    </div>
  );
};

export default DatePickerButton;
