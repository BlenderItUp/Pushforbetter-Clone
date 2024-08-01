import React, { useState } from 'react';
import TopBar from './topbar/TopBar';
import CircularSliderComponent from './circularslider/CircularSlider';
import { useSelector } from 'react-redux';
import { RootState } from '../store';


const Dashboard: React.FC = () => {
    const currentDayId = useSelector((state: RootState) => state.settings.currentDayId);

    return (
        <div className="dashboard">
            <TopBar />
            <CircularSliderComponent currentDayId={currentDayId} />
        </div>
    );
}

export default Dashboard;