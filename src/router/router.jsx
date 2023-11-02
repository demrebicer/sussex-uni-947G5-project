import { Routes, Route } from "react-router-dom";

// Pages
import MainMenu from "../pages/mainMenu";
import TasksMenu from "../pages/tasksMenu";
import NQueensProblem from "../pages/nQueensProblem";
import PolyspherePuzzle from "../pages/polyspherePuzzle";
import Test from "../pages/test";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainMenu />} />
      <Route path="/tasks" element={<TasksMenu />} />
      <Route path="/nqueensproblem" element={<NQueensProblem />} />
      <Route path="/polyspherepuzzle" element={<PolyspherePuzzle />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default Router;
