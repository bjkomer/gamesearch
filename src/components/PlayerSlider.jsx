import { useState, useRef } from 'react';
import Slider from '@mui/material/Slider';

export default function PlayerSlider() {
    const [value, setValue] = useState([1, 10]);
    const sliderRef = useRef(null);

    const min = 1;
    const max = 10;
    const step = 1;
    const handleTrackClick = (e) => {
        if (!sliderRef.current) return;
    
        const rect = sliderRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
    
        const rawValue = min + percent * (max - min);
        const snappedValue = Math.round(rawValue); // snap to nearest mark
        if ((value[0] != snappedValue) && (value[1] != snappedValue)) {
            event.stopPropagation();
            setValue([snappedValue, snappedValue]);
        }
    };

    const handleLabelClick = (val, event) => {
        event.stopPropagation(); // Prevent default slider thumb snap
        setValue([val, val]);    // Set both thumbs to the same point
    };

    const marks = Array.from({ length: 10 }, (_, i) => {
        const val = i + 1;
        return {
          value: val,
          label: (
            <span
              onClick={(e) => handleLabelClick(val, e)}
              style={{ cursor: 'pointer' }}
            >
              {val}
            </span>
          ),
        };
    });
    return (
        <Slider 
            min={1}
            max={10}
            step={1}
            marks={marks}
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            onClick={(e) => {
                // Only handle track clicks if we're not clicking on a thumb
                if (e.target.getAttribute('aria-valuenow') === null) {
                    handleTrackClick(e);
                }
                // handleTrackClick(e);
            }}
            valueLabelDisplay="auto"
            aria-labelledby="player-slider"
            sx={{
                '& .MuiSlider-markLabel': {
                  color: 'white',
                },
            }}
            ref={sliderRef}
        />
    );
}