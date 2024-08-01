import React from 'react';
import './TopBar.css';
import useStore from '../../stores/Store';

interface TopBarProps {
    items: { exercise: string, current: number, max: number }[];
    selectedItemIndex: number;
    onItemClick: (index: number) => void;
}

const calculateStrokeDashoffset = (current: number, max: number) => {
    const circumference = 2 * Math.PI * 15; // Radius of the circle is 15
    return circumference - (current / max) * circumference;
};

const TopBar: React.FC<TopBarProps> = ({ items, selectedItemIndex, onItemClick }) => {
    const programs = useStore((state) => state.programs);

    return (
        <div className="top-bar">
            <div className="scroll-container">
                {programs[1].days.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`item ${index === selectedItemIndex ? 'selected' : ''}`} 
                        onClick={() => onItemClick(index)}
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
                                strokeDashoffset={calculateStrokeDashoffset(item.current, item.max)}
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
                        {/* <div>{item.exercise}</div> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopBar;
