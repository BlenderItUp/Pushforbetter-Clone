import React, { useState } from 'react';
import TopBar from './topbar/TopBar';
import CircularSliderComponent from './circularslider/CircularSlider';


const initialItems = [
    { exercise: 'Bench', current: 5, max: 10 },
    { exercise: 'Squat', current: 3, max: 10 },
    { exercise: 'Deadlift', current: 7, max: 10 },
    { exercise: 'Overhead press', current: 10, max: 10 },
    { exercise: 'Pull-up', current: 1, max: 10 },
    { exercise: 'Row', current: 8, max: 10 },
    { exercise: 'Leg press', current: 4, max: 10 }
];

const Dashboard: React.FC = () => {
    const [items, setItems] = useState(initialItems);
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

    const handleItemClick = (index: number) => {
        setSelectedItemIndex(index);
    };

    const handleSliderChange = (value: number) => {
        // console.log(value)
        const newItems = [...items];
        newItems[selectedItemIndex].current = value;
        setItems(newItems);
    };

    return (
        <div className="dashboard">
            <TopBar items={items} selectedItemIndex={selectedItemIndex} onItemClick={handleItemClick} />
            <CircularSliderComponent 
                key={selectedItemIndex} // Unique key to force re-render
                min={0} 
                max={items[selectedItemIndex].max} 
                value={items[selectedItemIndex].current} 
                exercise={items[selectedItemIndex].exercise}
                onChange={handleSliderChange} 
            />
        </div>
    );
}

export default Dashboard;