import styles from "./sectors.module.css";
import { FormEvent, useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../../../services/firebaseConnection";
import { icons } from "../../../../config/icons";
import {
  editRoleOrSector,
  handleRegisterRoleOrSector,
} from "../../../../utils";
import { Input } from "../../../../components/ui/input/input";
import { Button } from "../../../../components/ui/buttons/button/button";
import { FormCenter } from "../../../../components/ui/formCenter";
import { Modal } from "../../../../components/interface/modal";
import { Cards } from "../../../../components/interface/cards";
import {
  EmployerContext,
  RolesOrSectors,
} from "../../../../contexts/employerContext";

export function Sectors() {
  const [sector, setSector] = useState<string>("");
  const [newSector, setNewSector] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalNewSectorVisible, setModalNewSectorVisible] =
    useState<boolean>(false);
  const [modalEditSectorVisible, setModalEditSectorVisible] =
    useState<boolean>(false);
  const [currentIdEdit, setCurrentIdEdit] = useState<string>("");

  const { listSectors, setListSectors } = useContext(EmployerContext);

  async function handleRegister(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    const nameUpper = sector.toLocaleUpperCase();

    const roleExist = listSectors.filter((item) => item.name === nameUpper);

    if (roleExist.length > 0) {
      toast.error("Esse cargo já está cadastrado!");
      setLoading(false);
      return;
    }

    const docRef = collection(db, "sectors");
    const response = await handleRegisterRoleOrSector({
      name: nameUpper,
      docRef,
      setLoading,
    });

    if (response) {
      setListSectors([...listSectors, response]);
    }
    setSector("");
    setLoading(false);
  }

  //  Editando Role
  async function handleEdit() {
    setLoading(true);

    const docRef = doc(db, "sectors", currentIdEdit);

    const newSectorUpper = newSector.toLocaleUpperCase();
    const response = await editRoleOrSector({ docRef, name: newSectorUpper });

    if (response) {
      toast.success("Sucesso ao atualizar setor");

      const newListSectors = listSectors;
      const indexSectorUpdate = newListSectors.findIndex(
        (item) => item.id === currentIdEdit
      );

      newListSectors[indexSectorUpdate].name = newSectorUpper;

      setListSectors(newListSectors);

      setLoading(false);
      handleCloseEdit();
      return;
    } else {
      toast.error("Erro ao atualizar setor!");
    }

    setLoading(false);
    handleCloseEdit();
  }

  async function handleModalEdit(item: RolesOrSectors) {
    setModalEditSectorVisible(true);
    setCurrentIdEdit(item.id);
    setSector(item.name);
    setNewSector(item.name);
  }
  function handleClose() {
    setSector("");
    setModalNewSectorVisible(false);
  }

  function handleCloseEdit() {
    setModalEditSectorVisible(false);
    setCurrentIdEdit("");
    setSector("");
    setNewSector("");
  }

  return (
    <section className={styles.container}>
      <section>
        <button
          className={styles.buttonNewSector}
          onClick={() => setModalNewSectorVisible(true)}
        >
          <span>{icons.plus}</span>Novo Setor
        </button>
      </section>
      <Cards edit={handleModalEdit} list={listSectors} />

      {modalNewSectorVisible && (
        <Modal handleClose={handleClose} title={"Cadastre um Setor"}>
          <FormCenter>
            <label>
              Setor:
              <Input
                setValue={setSector}
                value={sector}
                placeholder="Digite um setor"
              />
            </label>

            <Button
              disabled={sector === ""}
              loading={loading}
              onClick={(e) => handleRegister(e)}
            >
              Cadastrar
            </Button>
          </FormCenter>
        </Modal>
      )}

      {modalEditSectorVisible && currentIdEdit !== "" && (
        <Modal handleClose={handleCloseEdit} title={"Editando Setor"}>
          <FormCenter>
            <label>
              Setor:
              <Input
                setValue={setNewSector}
                value={newSector}
                placeholder="Digite o novo setor"
              />
            </label>

            <Button
              disabled={newSector === "" || newSector === sector}
              loading={loading}
              onClick={handleEdit}
            >
              Editar
            </Button>
          </FormCenter>
        </Modal>
      )}
    </section>
  );
}
