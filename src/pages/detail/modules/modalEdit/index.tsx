import { SetStateAction, Dispatch } from "react"
import { Modal } from "../../../../components/interface/modal";
import { FormEmploye } from "../../../../components/interface/formEmploye";
import { DataEmploye } from "../../../../contexts/employerContext";

interface ModalEdit {
  setValue: Dispatch<SetStateAction<boolean>>;
  currentDataEmploye: DataEmploye
}

export function ModalEdit({ setValue, currentDataEmploye }: ModalEdit) {

  function handleClose() {
    setValue(false);
  }

  async function handleEdit() {
    console.log("enviou")
  }

  return (
    <Modal handleClose={handleClose} title="Editando Dados do Funcionário">
      <FormEmploye
        currentDataEmploye={currentDataEmploye}
        handleSubmit={handleEdit}
        action="edit"
      />
    </Modal>
  )
}