import { CollectionReference, DocumentData, addDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface HandleRegisterProps {
  name: string;
  docRef: CollectionReference<DocumentData>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export async function handleRegisterRoleOrSector({
  name,
  docRef,
  setLoading,
}: HandleRegisterProps) {
  if (name === "") {
    toast.error("Preencha os campos corretamente!");
    setLoading(false);
    return;
  }

  try {
    const nameUpper = name.toLocaleUpperCase();
    const response = await addDoc(docRef, { name: nameUpper });

    const newDoc = {
      name,
      id: response.id,
    };

    toast.success("Cargo cadastrado com sucesso!");
    return newDoc;
  } catch (error) {
    toast.error("Erro ao cadastrar Cargo!");
  }
}
