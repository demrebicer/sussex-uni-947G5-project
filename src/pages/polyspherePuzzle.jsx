import React, { useState } from 'react';
import mainMenuBackground from "../assets/images/mainMenuBackground.svg";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Tooltip, Button } from "@nextui-org/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";

const PolyspherePuzzle = () => {
  
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/tasks");
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden z-0">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 pointer-events-none -z-20">
          <img src={mainMenuBackground} alt="Main Menu Background" />
        </div>
      </div>

      <div className="flex w-full h-full z-10">
        {/* PolyspherePuzzle  */}
      </div>

      <div className="absolute top-0 left-0 p-4 z-10">
        <Button
          auto
          isIconOnly
          color="default"
          onClick={goBack}
          variant="bordered"
          className="text-white flex items-center border-none"
        >
          <FiArrowLeft size={32} />
        </Button>
      </div>
    </div>
  );
};

export default PolyspherePuzzle;
