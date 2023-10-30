import { SetStateAction, Dispatch, useContext } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

import { Modal } from "../../../../components/interface/modal";
import { FormEmploye } from "../../../../components/interface/formEmploye";
import {
  DataEmploye,
  EmployerContext,
} from "../../../../contexts/employerContext";
import { db, storage } from "../../../../services/firebaseConnection";

interface ModalEdit {
  setValue: Dispatch<SetStateAction<boolean>>;
  setEmploye: Dispatch<SetStateAction<DataEmploye | null>>;
  currentDataEmploye: DataEmploye;
}

export function ModalEdit({
  setValue,
  currentDataEmploye,
  setEmploye,
}: ModalEdit) {
  const { listEmployes, setListEmployes } = useContext(EmployerContext);
  function handleClose() {
    setValue(false);
  }

  async function handleEdit({ dataEmploye, file }: any) {
    if (dataEmploye === currentDataEmploye) {
      // usuário não fez alterações
      toast.error("Nenhuma alterção foi feita!");
      return;
    }
    try {
      if (!!file) {
        // usuário alterou a imagen de perfil
        const uploadRef = ref(storage, `images/${dataEmploye.id}/${file.name}`);

        const imgUrl = await uploadBytes(uploadRef, file);

        const url = await getDownloadURL(imgUrl.ref);
        dataEmploye.profileUrl = url;
      }

      const updateDocRef = doc(db, "employes", dataEmploye.id);
      const employeUpdate = await updateDoc(updateDocRef, dataEmploye);

      const newListEmployes = listEmployes;
      const indexUpdateEmploye = newListEmployes.findIndex(
        (employe) => employe.id === dataEmploye.id
      );

      const hitoryRef = collection(updateDocRef, "history");
      const responseHistory = await addDoc(hitoryRef, {
        ...currentDataEmploye,
        created_at: new Date(),
      });

      newListEmployes[indexUpdateEmploye] = dataEmploye;
      setListEmployes(newListEmployes);
      setEmploye(dataEmploye);
      toast.success("Dados atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados!");
    } finally {
      setValue(false);
    }
  }

  return (
    <Modal handleClose={handleClose} title="Editando Dados do Funcionário">
      <FormEmploye
        currentDataEmploye={currentDataEmploye}
        handleSubmit={handleEdit}
        action="edit"
      />
    </Modal>
  );
}
