import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularSlider from '@fseehawer/react-circular-slider';
import { RootState } from '../../store';
import { setCurrentDayId } from '../../slices/settingsSlice';
import './CircularSlider.css';
const CircularSliderComponent: React.FC = () => {
    const dispatch = useDispatch();
    const currentDayId = useSelector((state: RootState) => state.settings.currentDayId);
    const currentProgramId = useSelector((state: RootState) => state.settings.currentProgramId);
    const userPrograms = useSelector((state: RootState) => state.programs.userPrograms);

    // Retrieve the current program and day
    const program = userPrograms[currentProgramId];
    const day = program?.days.find(d => d.id === currentDayId);

    if (!day) {
        return <div>Loading...</div>; // Or handle the case when the day is not yet loaded
    }

    const { actiondate, maxreps, name } = day;
    const min = 0; // Define min if necessary
    const value = day.userdayprogress?.reps || 0; // Default to 0 if userdayprogress is empty

    useEffect(() => {
        // Handle any side effects or actions on day or program change
    }, [currentDayId, currentProgramId, dispatch]);

    const handleChange = (value: number) => {
        // Dispatch an action to update the store with the new value
        dispatch(setCurrentDayId(value));
    };

    return (
        <div className="circular-slider-container">
            <CircularSlider
                min={min}
                max={maxreps}
                label={name}
                value={value}
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
                onChange={handleChange}
            />
        </div>
    );
};

export default CircularSliderComponent;
