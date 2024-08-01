import React, { useEffect, useState } from 'react';
import CircularSlider from '@fseehawer/react-circular-slider';
import './CircularSlider.css';

interface CircularSliderProps {
    min: number;
    max: number;
    value: number;
    exercise: string;
    onChange: (value: number) => void;
}

const CircularSliderComponent: React.FC<CircularSliderProps> = ({ min, max, value, exercise, onChange }) => {
    const [dataIndex, setDataIndex] = useState(value);

    useEffect(() => {
        setDataIndex(value);
    }, [exercise]);
    

    return (
        <div className="circular-slider-container">
            <CircularSlider
                min={min}
                max={max}
                label={exercise}
                initialValue={value}
                value={value}
                dataIndex={dataIndex}
                knobColor="#e74c3c"
                progressColorFrom="#80C3F3"
                progressColorTo="#4990E2"
                trackColor="#DDDEFB"
                trackSize={32}
                knobSize={48}
                continuous={{
                    enabled: true,
                    clicks: 10,
                    interval: 1,
                }}
                onChange={onChange}
            />
        </div>
    );
};

export default CircularSliderComponent;
