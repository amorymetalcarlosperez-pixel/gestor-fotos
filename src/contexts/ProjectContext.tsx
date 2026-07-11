import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getProjectDevices } from "../services/projectDevices";

type ProjectContextType = {

  devices: any[];

  refresh: () => Promise<void>;

};

const ProjectContext =
  createContext<ProjectContextType>(null!);

export function ProjectProvider({

  projectId,

  children,

}: {

  projectId: string;

  children: React.ReactNode;

}) {

  const [devices, setDevices] =
    useState<any[]>([]);

  useEffect(() => {

    refresh();

  }, [projectId]);

  async function refresh() {

    const { data } =
      await getProjectDevices(projectId);

    setDevices(data ?? []);

  }

  return (

    <ProjectContext.Provider

      value={{

        devices,

        refresh,

      }}

    >

      {children}

    </ProjectContext.Provider>

  );

}

export function useProject() {

  return useContext(ProjectContext);

}