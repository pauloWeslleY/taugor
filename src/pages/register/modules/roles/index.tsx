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

    // validando se o usuário está tentando cadastrar um cargo já existente
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

    //caso o cadastro dê certo response recebe o objeto que foi criado armazenando name e id
    //para ser adicionado no state que renderiza os cargos
    if (response) {
      setListRoles([...listRoles, response]);
    }
    setRole("");
    setLoading(false);
  }

  async function handleModalEdit(item: RolesOrSectors) {
    setModalEditRoleVisible(true);
    setCurrentIdEdit(item.id);
    // setando os 2 valores para validar se o usuário fez alguma alteração
    setRole(item.name);
    setNewRole(item.name);
  }

  //  Editando cargo
  async function handleEdit() {
    setLoading(true);

    // função retorna boolean para alteração de state local
    const docRef = doc(db, "roles", currentIdEdit);

    const newRoleUpper = newRole.toLocaleUpperCase();
    const response = await editRoleOrSector({ docRef, name: newRoleUpper });

    if (response) {
      toast.success("Sucesso ao atualizar cargo");

      //atualizando o state local com o novo nome
      const newListRoles = listRoles;
      //identificando o index do item atualizado
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
  //fechar modais
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
