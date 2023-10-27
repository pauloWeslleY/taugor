import { DocumentData, DocumentReference, updateDoc } from "firebase/firestore";

export async function editRoleOrSector({
  docRef,
  name,
}: {
  docRef: DocumentReference<DocumentData>;
  name: string;
}) {
  try {
    const response = await updateDoc(docRef, {
      name,
    });
    return true;
  } catch (error) {
    return false;
  }
}
