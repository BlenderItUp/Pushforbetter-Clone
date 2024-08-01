import React, { useState } from 'react';
import TopBar from './topbar/TopBar';
import CircularSliderComponent from './circularslider/CircularSlider';


const Dashboard: React.FC = () => {

    return (
        <div className="dashboard">
            <TopBar />
            <CircularSliderComponent />
        </div>
    );
}

export default Dashboard;