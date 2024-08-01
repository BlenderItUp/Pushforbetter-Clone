import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularSlider, { CircularSliderWithChildren } from 'react-circular-slider-svg';
import { RootState } from '../../store';
import { updateUserDayProgressAsync } from '../../slices/programsSlice'; // Adjust import based on actual action
import './CircularSlider.css';

// Define the interface for props
interface CircularSliderComponentProps {
    currentDayId: number;
}

const CircularSliderComponent: React.FC<CircularSliderComponentProps> = ({ currentDayId }) => {
    const dispatch = useDispatch();
    const currentProgramId = useSelector((state: RootState) => state.settings.currentProgramId);
    const userPrograms = useSelector((state: RootState) => state.programs.userPrograms);

    // Retrieve the current program and day
    const program = userPrograms[currentProgramId];
    const day = program?.days.find(d => d.id === currentDayId);

    const [value, setValue] = useState<number>(0); // Manage internal state
    const [angle, setAngle] = useState<number>(0); // Track the current angle
    const previousAngleRef = useRef<number | null>(null);
    const loopsRef = useRef<number>(0); // Track the number of loops

    useEffect(() => {
        if (day && day.userdayprogress) {
            setValue(day.userdayprogress.reps || 0); // Update internal state when currentDayId changes
        }
    }, [currentDayId, day]);

    if (!day || !currentDayId || !currentProgramId) {
        return <div>Loading...</div>;
    }

    const { maxreps, name } = day;

    const setValueWithLimits = (newValue: number) => {
        if (newValue < 0) {
            setValue(0);
        } else if (newValue > maxreps) {
            setValue(maxreps);
        } else {
            setValue(newValue);
        }
    };

    const handleChange = (newAngle: number) => {
        // Update the angle
        setAngle(newAngle);

        // Check for crossing the zero-degree line
        if (previousAngleRef.current !== null) {
            const previousAngle = previousAngleRef.current;
            if (previousAngle > 270 && newAngle < 90) {
                loopsRef.current += 1; // Increment loop count when moving from 360 to 0
            } else if (previousAngle < 90 && newAngle > 270) {
                loopsRef.current -= 1; // Decrement loop count when moving from 0 to 360
            }
        }
        previousAngleRef.current = newAngle;

        // Calculate the new value based on loops
        const newValue = loopsRef.current * 10 + (newAngle / 360) * 10;
        setValueWithLimits(Math.floor(newValue));
    };

    const handleSave = () => {
        // Dispatch action to update userdayprogress.reps
        dispatch(updateUserDayProgressAsync({ dayId: day.id, reps: value }));
    };

    return (
        <div className="circular-slider-container">
            <CircularSliderWithChildren
                size={200}
                trackWidth={10}
                handle1={{
                    value: angle,
                    onChange: handleChange
                }}
                minValue={0}
                maxValue={360}
                coerceToInt={true}
                handleSize={16}
                startAngle={0}
                endAngle={360}
                angleType={{ direction: 'cw', axis: '+y' }}
                arcColor="#e74c3c"
                arcBackgroundColor="#DDDEFB"
                outerShadow={true}
                onControlFinished={handleSave}
            >
                <div style={{ textAlign: "center", fontSize: "40px" }}>
                    {value}
                </div>
            </CircularSliderWithChildren>
        </div>
    );
};

export default CircularSliderComponent;
