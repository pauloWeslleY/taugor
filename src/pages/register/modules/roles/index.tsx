import styles from "./roles.module.css";
import { FormEvent, useContext, useState } from "react";
import { collection, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../../../../services/firebaseConnection";
import { icons } from "../../../../config/icons";
import {
  handleRegisterRoleOrSector,
  editRoleOrSector,
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

export function Roles() {
  const [role, setRole] = useState<string>("");
  const [newRole, setNewRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalNewRoleVisible, setModalNewRoleVisible] =
    useState<boolean>(false);
  const [modalEditRoleVisible, setModalEditRoleVisible] =
    useState<boolean>(false);
  const [currentIdEdit, setCurrentIdEdit] = useState<string>("");

  const { listRoles, setListRoles } = useContext(EmployerContext);

  async function handleRegister(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    const nameUpper = role.toLocaleUpperCase();

    const roleExist = listRoles.filter((item) => item.name === nameUpper);

    if (roleExist.length > 0) {
      toast.error("Esse cargo já está cadastrado!");
      setLoading(false);
      return;
    }

    const docRef = collection(db, "roles");
    const response = await handleRegisterRoleOrSector({
      name: nameUpper,
      docRef,
      setLoading,
    });

    if (response) {
      setListRoles([...listRoles, response]);
    }
    setRole("");
    setLoading(false);
  }

  async function handleModalEdit(item: RolesOrSectors) {
    setModalEditRoleVisible(true);
    setCurrentIdEdit(item.id);

    setRole(item.name);
    setNewRole(item.name);
  }

  async function handleEdit() {
    setLoading(true);

    const docRef = doc(db, "roles", currentIdEdit);

    const newRoleUpper = newRole.toLocaleUpperCase();
    const response = await editRoleOrSector({ docRef, name: newRoleUpper });

    if (response) {
      toast.success("Sucesso ao atualizar cargo");

      const newListRoles = listRoles;

      const indexRoleUpdate = newListRoles.findIndex(
        (item) => item.id === currentIdEdit
      );

      newListRoles[indexRoleUpdate].name = newRoleUpper;

      setListRoles(newListRoles);

      setLoading(false);
      handleCloseEdit();
      return;
    } else {
      toast.error("Erro ao atualizar cargo!");
    }

    setLoading(false);
    handleCloseEdit();
  }

  function handleClose() {
    setRole("");
    setModalNewRoleVisible(false);
  }

  function handleCloseEdit() {
    setModalEditRoleVisible(false);
    setCurrentIdEdit("");
    setRole("");
    setNewRole("");
  }

  return (
    <section className={styles.container}>
      <section>
        <button
          className={styles.buttonNewRole}
          onClick={() => setModalNewRoleVisible(true)}
        >
          <span>{icons.plus}</span>Novo Cargo
        </button>
      </section>
      <Cards edit={handleModalEdit} list={listRoles} />

      {modalNewRoleVisible && (
        <Modal handleClose={handleClose} title={"Cadastre um Cargo"}>
          <FormCenter>
            <label>
              Cargo:
              <Input
                setValue={setRole}
                value={role}
                placeholder="Digite um cargo"
              />
            </label>

            <Button
              disabled={role === ""}
              loading={loading}
              onClick={(e) => handleRegister(e)}
            >
              Cadastrar
            </Button>
          </FormCenter>
        </Modal>
      )}

      {modalEditRoleVisible && currentIdEdit !== "" && (
        <Modal handleClose={handleCloseEdit} title={"Atualizando Cargo"}>
          <FormCenter>
            <label>
              Setor:
              <Input
                setValue={setNewRole}
                value={newRole}
                placeholder="Atualize o cargo"
              />
            </label>

            <Button
              disabled={newRole === "" || newRole === role}
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
