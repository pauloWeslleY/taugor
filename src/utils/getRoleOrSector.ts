import { CollectionReference, DocumentData, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { ListRolesOrSectors } from "../contexts/employerContext";

export async function getRoleOrSector(
  docRef: CollectionReference<DocumentData>
) {
  try {
    const response = await getDocs(docRef);

    let list: ListRolesOrSectors = [];

    response.forEach((item) => {
      list.push({
        id: item.id,
        name: item.data().name,
      });
    });

    return list;
  } catch (error) {
    toast.error("Erro ao fazer a busca");
  }
}
