import styles from './sectors.module.css';
import { FormEvent, useContext, useState } from "react";
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
import { EmployerContext } from '../../../../contexts/employerContext';

type Sectors = Card[]

export function Sectors() {

  const [sector, setSector] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalNewSectorVisible, setModalNewSectorVisible] = useState<boolean>(false);

  const { listSectors, setListSectors } = useContext(EmployerContext);


  async function handleRegister(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    const nameUpper = sector.toLocaleUpperCase();

    // validando se o usuário está tentando cadastrar um cargo já existente
    const roleExist = listSectors.filter((item) => item.name === nameUpper);

    if (roleExist.length > 0) {
      toast.error("Esse cargo já está cadastrado!");
      setLoading(false)
      return;
    };

    const docRef = collection(db, "sectors");
    const response = await handleRegisterRoleOrSector({ name: nameUpper, docRef, setLoading });

    //caso o cadastro dê certo response recebe o objeto que foi criado armazenando name e id
    //para ser adicionado no state que renderiza os cargos
    if (response) {
      setListSectors([...listSectors, response]);
    }
    setSector("")
    setLoading(false);
  };

  function handleClose() {
    setSector("");
    setModalNewSectorVisible(false);
  };

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
      <Cards edit={() => { }} list={listSectors} />

      {modalNewSectorVisible && (
        <Modal handleClose={handleClose} title={"Cadastre um Setor"}>
          <FormCenter >
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

    </section>
  );
};