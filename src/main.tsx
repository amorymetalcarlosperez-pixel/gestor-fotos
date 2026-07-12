import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createHashRouter } from "react-router-dom";

import "./index.css";

import { router } from "./router/router";

const hashRouter = createHashRouter(router.routes, {
  basename: "/gestor-fotos",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={hashRouter} />
  </React.StrictMode>
);