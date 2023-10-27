import { CollectionReference, DocumentData, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { Card } from "../components/types/RolesOrSector";

type ListDoc = Card[];

export async function GetRoleOrSector(
  docRef: CollectionReference<DocumentData>
) {
  try {
    const response = await getDocs(docRef);

    let list: ListDoc = [];

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
