import styles from './roles.module.css';
import { FormEvent, useState } from "react";
import { collection, } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from "../../../../services/firebaseConnection";
import { icons } from '../../../../config/icons';
import { handleRegisterRoleOrSector } from '../../../../utils';
import { Input } from "../../../../components/ui/input/input";
import { Button } from "../../../../components/ui/buttons/button/button";
import { FormCenter } from '../../../../components/ui/formCenter';
import { Modal } from '../../../../components/interface/modal';
import { Cards } from '../../../../components/interface/cards';
import { Card } from '../../../../components/types/RolesOrSector';

type Roles = Card[]

export function Roles() {

  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalNewRoleVisible, setModalNewRoleVisible] = useState<boolean>(false);
  const [listRoles, setListRoles] = useState<Roles>([]);


  async function handleRegister(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    const nameUpper = role.toLocaleUpperCase();

    // validando se o usuário está tentando cadastrar um cargo já existente
    const roleExist = listRoles.filter((item) => item.name === nameUpper);

    if (roleExist.length > 0) {
      toast.error("Esse cargo já está cadastrado!");
      setLoading(false)
      return;
    };

    const docRef = collection(db, "roles");
    const response = await handleRegisterRoleOrSector({ name: nameUpper, docRef, setLoading });

    //caso o cadastro dê certo response recebe o objeto que foi criado armazenando name e id
    //para ser adicionado no state que renderiza os cargos
    if (response) {
      setListRoles([...listRoles, response]);
    }
    setRole("")
    setLoading(false);
  };

  function handleClose() {
    setRole("");
    setModalNewRoleVisible(false);
  };

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
      <Cards edit={() => { }} list={listRoles} />

      {modalNewRoleVisible && (
        <Modal handleClose={handleClose} title={"Cadastre um Cargo"}>
          <FormCenter >
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

    </section>
  );
};