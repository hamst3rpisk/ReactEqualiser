import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AppTemplate from "./components/templates/AppTemplate/AppTemplate";
import MainPage from "./components/pages/MainPage/MainPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppTemplate />}>
      <Route element={<MainPage />} path="/" />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
