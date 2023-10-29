import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";

import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConnection";
import { getRoleOrSector } from "../utils";

interface EmployerContextProps {
  listRoles: ListRolesOrSectors;
  setListRoles: Dispatch<SetStateAction<ListRolesOrSectors>>;
  listSectors: ListRolesOrSectors;
  setListSectors: Dispatch<SetStateAction<ListRolesOrSectors>>;
  listEmployes: ListDataEmploye;
  setListEmployes: Dispatch<SetStateAction<ListDataEmploye>>;
  loadingEmployes: boolean;
}

export interface RolesOrSectors {
  name: string;
  id: string;
}

export type ListRolesOrSectors = RolesOrSectors[];
export type ListDataEmploye = DataEmploye[];

export interface DataEmploye extends DataNewEmployeData {
  id: string;
  created_at: Date | Timestamp;
}

type Status = "active" | "fired" | "end_of_contract";
export interface DataNewEmployeData {
  name: string;
  profileUrl: string | null;
  sex: string;
  cpf: string;
  email: string;
  address: string;
  tel: string;
  dateAdmission: string;
  birth: string;
  role: string;
  status: Status;
  sector: string;
  wage: string;
}

export const EmployerContext = createContext({} as EmployerContextProps);

export default function EmployerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [listRoles, setListRoles] = useState<ListRolesOrSectors>([]);
  const [listSectors, setListSectors] = useState<ListRolesOrSectors>([]);
  const [listEmployes, setListEmployes] = useState<ListDataEmploye>([]);

  const [loadingEmployes, setLoadingEmployes] = useState<boolean>(true);

  // buscando cargos e setores
  useEffect(() => {
    async function loadingRoles() {
      try {
        const docRef = collection(db, "roles");
        const response = await getRoleOrSector(docRef);

        if (response) {
          setListRoles(response);
        }
      } catch (error) {
        toast.error("Erro ao carregar cargos!");
      }
    }
    loadingRoles();
  }, []);

  useEffect(() => {
    async function loadingSectors() {
      try {
        const docRef = collection(db, "sectors");
        const response = await getRoleOrSector(docRef);

        if (response) {
          setListSectors(response);
        }
      } catch (error) {
        toast.error("Erro ao carregar setores!");
      }
    }
    loadingSectors();
  }, []);

  // buscando funcionarios
  useEffect(() => {
    async function loadEmployes() {
      setLoadingEmployes(true);
      try {
        const docRef = collection(db, "employes");

        const response = await getDocs(docRef);

        if (response) {
          let list: ListDataEmploye = [];
          response.forEach((employe) => {
            list.push({
              id: employe.id,
              name: employe.data().name,
              email: employe.data().email,
              cpf: employe.data().cpf,
              birth: employe.data().birth,
              address: employe.data().address,
              profileUrl: employe.data().profileUrl,
              role: employe.data().role,
              sector: employe.data().sector,
              sex: employe.data().sex,
              status: employe.data().status,
              tel: employe.data().tel,
              wage: employe.data().wage,
              dateAdmission: employe.data().dateAdmission,
              created_at: employe.data().creatd_at,
            });
          });
          setListEmployes(list);
        }
      } catch (error) {
        toast.error("Error o buscr funcionários!");
      } finally {
        setLoadingEmployes(false);
      }
    }
    loadEmployes();
  }, []);

  return (
    <EmployerContext.Provider
      value={{
        listRoles,
        setListRoles,
        listSectors,
        setListSectors,
        listEmployes,
        setListEmployes,
        loadingEmployes,
      }}
    >
      {children}
    </EmployerContext.Provider>
  );
}
