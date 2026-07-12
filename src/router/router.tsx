import { createHashRouter } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import ScanPage from "../pages/Scanner/ScanPage";
import NewProject from "../pages/Projects/NewProject";
import Project from "../pages/Projects/Project";
import Category from "../pages/Projects/Category";
import Location from "../pages/Projects/Location";
import Device from "../pages/Projects/Device";
import UnknownDevice from "../pages/Scanner/UnknownDevice";
export const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/projects/new",
    element: <NewProject />,
  },
  {
  path: "/projects/:projectId/unknown/:assetTag",
  element: <UnknownDevice />,
},
  {
    path: "/projects/:projectId",
    element: <Project />,
  },
  {
  path: "/projects/:projectId/scan",
  element: <ScanPage />,
},
  {
    path: "/projects/:projectId/:category",
    element: <Category />,
  },
  {
    path: "/projects/:projectId/:category/:location",
    element: <Location />,
  },
  {
    path: "/projects/:projectId/:category/:location/:deviceId",
    element: <Device />,
  },
]);