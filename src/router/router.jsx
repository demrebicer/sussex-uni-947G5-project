import { Routes, Route } from "react-router-dom";

// Pages
import MainMenu from "../pages/mainMenu";
import TasksMenu from "../pages/tasksMenu";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/tasks" element={<TasksMenu />} />
    </Routes>
  );
}

export default Router;
