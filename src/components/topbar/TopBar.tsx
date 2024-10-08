import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setCurrentDayId } from '../../slices/settingsSlice';
import './TopBar.css';


const calculateStrokeDashoffset = (current: number = 0, max: number = 0): number => {
    const circumference = 2 * Math.PI * 15; // Radius of the circle is 15
    return circumference - (current / max) * circumference;
};

const TopBar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentProgramId } = useSelector((state: RootState) => state.settings);
    const userPrograms = useSelector((state: RootState) => state.programs.userPrograms);
    const program = userPrograms[currentProgramId];

    const seletectedDay = useSelector((state: RootState) => state.settings.currentDayId);

    if (!program) {
        return <div>Loading...</div>; 
    }


    return (
        <div className="top-bar">
            <div className="scroll-container">
                {program.days.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`item ${item.id === seletectedDay ? 'selected' : ''}`} 
                        onClick={() => {
                            dispatch(setCurrentDayId(item.id)); 
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <circle
                                cx="20"
                                cy="20"
                                r="15"
                                fill="none"
                                stroke="#ddd"
                                strokeWidth="5"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="15"
                                fill="none"
                                stroke="#00FF00"
                                strokeWidth="5"
                                strokeDasharray="94.2" // 2 * Math.PI * 15
                                strokeDashoffset={calculateStrokeDashoffset(item.userdayprogress?.reps, item.maxreps)}
                                transform="rotate(-90 20 20)"
                                strokeLinecap="round"
                            />
                            <text
                                x="20"
                                y="25"
                                textAnchor="middle"
                                fill="#fff"
                                fontSize="12"
                                fontFamily="Arial"
                            >
                                {index}
                            </text>
                        </svg>
                        <div>{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopBar;
