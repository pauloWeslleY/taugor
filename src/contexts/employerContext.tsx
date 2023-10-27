import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../services/firebaseConnection";
import { getRoleOrSector } from "../utils";

interface EmployerContextProps {
  listRoles: RolesOrSectors[]
  setListRoles: Dispatch<SetStateAction<RolesOrSectors[]>>
  listSectors: RolesOrSectors[]
  setListSectors: Dispatch<SetStateAction<RolesOrSectors[]>>
}

export interface RolesOrSectors {
  name: string,
  id: string
}

export type ListRolesOrSectors = RolesOrSectors[];

export const EmployerContext = createContext({} as EmployerContextProps);

export default function EmployerProvider({ children }: { children: ReactNode }) {
  const [listRoles, setListRoles] = useState<ListRolesOrSectors>([]);
  const [listSectors, setListSectors] = useState<ListRolesOrSectors>([]);

  useEffect(() => {
    async function loadingRoles() {
      const docRef = collection(db, "roles");
      const response = await getRoleOrSector(docRef);

      if (response) {
        setListRoles(response)
      }
    }
    loadingRoles();
  }, [])

  useEffect(() => {
    async function loadingSectors() {
      const docRef = collection(db, "sectors");
      const response = await getRoleOrSector(docRef);

      if (response) {
        setListSectors(response)
      }
    }
    loadingSectors();
  }, [])

  return (
    <EmployerContext.Provider
      value={{
        listRoles,
        setListRoles,
        listSectors,
        setListSectors,
      }}
    >
      {children}
    </EmployerContext.Provider>
  )
}