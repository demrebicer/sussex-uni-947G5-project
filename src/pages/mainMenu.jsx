import React from 'react';
import mainMenuBackground from '../assets/images/mainMenuBackground.svg';
import { Button } from '@nextui-org/react';

import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  let navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <img src={mainMenuBackground} alt="Main Menu Background" />
        </div>
      </div>
      <div className="z-10 text-center mb-12">
        <h1 className="text-8xl font-bold mb-4 text-white">University of Sussex</h1>
        <h2 className="text-5xl font-semibold text-gray-300">Advanced Computer Engineering</h2>
        <h3 className="text-4xl text-gray-400">Project Group 8</h3>
      </div>

      <Button
        className="z-10 border border-white py-3 px-8 rounded-lg text-3xl font-semibold text-white hover:bg-white hover:text-black transition duration-300"
        color="default"
        variant="bordered"
        onClick={() => navigate('/tasks')}
        style={{ height: '4rem' }}
      >
        Start Explore Project
      </Button>
    </div>
  );
};

export default MainMenu;
