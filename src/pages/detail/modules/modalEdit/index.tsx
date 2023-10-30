import { SetStateAction, Dispatch, useContext, useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

import { Modal } from "../../../../components/interface/modal";
import { FormEmploye } from "../../../../components/interface/formEmploye";
import {
  DataEmploye,
  EmployerContext,
  Status,
} from "../../../../contexts/employerContext";
import { db, storage } from "../../../../services/firebaseConnection";

interface ModalEdit {
  setValue: Dispatch<SetStateAction<boolean>>;
  setEmploye: Dispatch<SetStateAction<DataEmploye | null>>;
  currentDataEmploye: DataEmploye;
}

interface HandleUpdateStatusProps {
  action: Status;
  dataEmploye: DataEmploye;
}

export function ModalEdit({
  setValue,
  currentDataEmploye,
  setEmploye,
}: ModalEdit) {
  const { listEmployes, setListEmployes, setListHistory, listHistory } =
    useContext(EmployerContext);

  function handleClose() {
    setValue(false);
  }

  const { id, ...restCurrentData } = currentDataEmploye;
  const docRef = doc(db, "employes", id!);

  async function addHitory(dataEmploye: DataEmploye) {
    console.log("chamou a função");
    try {
      const hitoryRef = collection(docRef, "history");

      const responseHistory = await addDoc(hitoryRef, {
        ...restCurrentData,
        created_at: new Date(),
      });

      const newListEmployes = listEmployes;
      const indexUpdateEmploye = newListEmployes.findIndex(
        (employe) => employe.id === dataEmploye.id
      );

      newListEmployes[indexUpdateEmploye] = dataEmploye;
      setListEmployes(newListEmployes);

      console.log("data e", dataEmploye);
      setEmploye(dataEmploye);

      setListHistory([
        ...listHistory,
        { ...currentDataEmploye, id: responseHistory.id },
      ]);
      setValue(false);
    } catch (error) {
      toast.error("Erro ao criar histórico do funcionário!");
    }
  }

  async function handleEdit({ dataEmploye, file }: any) {
    if (dataEmploye === currentDataEmploye) {
      toast.error("Nenhuma alterção foi feita!");
      return;
    }
    try {
      if (!!file) {
        const uploadRef = ref(storage, `images/${dataEmploye.id}/${file.name}`);

        const imgUrl = await uploadBytes(uploadRef, file);

        const url = await getDownloadURL(imgUrl.ref);
        dataEmploye.profileUrl = url;
      }

      const updateDocRef = doc(db, "employes", dataEmploye.id);
      const employeUpdate = await updateDoc(updateDocRef, dataEmploye);

      toast.success("Dados atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados!");
    } finally {
      setValue(false);
    }
  }

  async function handleUpdateStatusEmploye({
    action,
    dataEmploye,
  }: HandleUpdateStatusProps) {
    const { status, id, ...rest } = dataEmploye;

    let message = "";
    if (action === "active") {
      message = "ativar funcionário";
    } else if (action === "fired") {
      message = "demitir funcionário";
    } else if (action === "end_of_contract") {
      message = "finalizar contrato";
    } else {
      message = "concluír";
    }

    try {
      if (id) {
        const response = await updateDoc(docRef, { status: action, ...rest });
        await addHitory({ status: action, ...rest, id });
      }

      toast.success(`Sucesso ao ${message}`);
    } catch (error) {
      toast.error(`Erro ao ${message}`);
    }
  }

  return (
    <Modal handleClose={handleClose} title="Editando Dados do Funcionário">
      <FormEmploye
        currentDataEmploye={currentDataEmploye}
        handleSubmit={handleEdit}
        action="edit"
        handlechangeStatus={handleUpdateStatusEmploye}
      />
    </Modal>
  );
}
