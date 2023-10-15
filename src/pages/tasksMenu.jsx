import React from "react";
import { Button } from "@nextui-org/react";
import mainMenuBackground from "../assets/images/mainMenuBackground.svg";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const tasks = [
  { id: "nqueensproblem", name: "Task 2: N-Queens Problem" },
  // { id: 2, name: 'Task 2: Math Challenge' },
];

const Tasks = () => {
  let navigate = useNavigate();

  const handleTaskClick = (taskId) => {
    navigate(`/${taskId}`);
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 z-10 pointer-events-none">
          <img src={mainMenuBackground} alt="Main Menu Background" />
        </div>
      </div>
      <div className="absolute top-0 left-0 z-20 p-4">
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
      <div className="z-10 text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 text-white">
          Please Choose Your Tasks
        </h1>
      </div>
      <div className="z-10 flex flex-wrap justify-center items-center gap-8 max-w-screen-lg">
        {tasks.map((task) => (
          <Button
            key={task.id}
            className="border-white text-white py-4 px-8 text-2xl hover:bg-white hover:text-black transition duration-300"
            auto
            color="default"
            variant="bordered"
            onClick={() => handleTaskClick(task.id)}
          >
            {task.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
