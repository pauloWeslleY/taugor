import styles from './newEmploye.module.css';
import { FormEvent, useContext, useState } from "react";

import { Input } from "../../../../components/ui/input/input";
import AvatarGirl from '../../../../assets/avatar-feminino.png';
import AvatarBoy from '../../../../assets/avatar-masculino.png';
import { icons } from "../../../../config/icons";
import { EmployerContext } from '../../../../contexts/employerContext';
import { Button } from '../../../../components/ui/buttons/button/button';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../services/firebaseConnection';
import { toast } from 'react-toastify';

type Status = "active" | "fired" | "end_of_contract"

interface dataEmployeProps {
  name: string,
  sex: string,
  cpf: string,
  birth: string,
  profileUrl: string | null,
  email: string,
  address: string,
  tel: string,
  role: string,
  sector: string,
  wage: number,
  dateAdmission: string,
  status: Status,
}

export function NewEmployer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataEmploye, setDataEmploye] = useState<dataEmployeProps>({
    name: "",
    sex: "masculine",
    cpf: "",
    profileUrl: null,
    address: "",
    dateAdmission: "",
    email: "",
    role: "",
    sector: "",
    status: "active",
    tel: "",
    wage: 0.0,
    birth: ""
  })

  const { listRoles, listSectors } = useContext(EmployerContext);

  function handleChange({ prop, value }: { prop: string, value: string }) {

    setDataEmploye({ ...dataEmploye, [prop]: value })
  }

  async function handleAddNewEmploye(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const {
      name,
      sex,
      cpf,
      profileUrl,
      address,
      dateAdmission,
      email,
      role,
      sector,
      status,
      tel,
      wage,
      birth
    } = dataEmploye;

    //validar se o cpf já está cadastrado

    //objeto a ser reutilizado caso o cadastro dê certo


    try {

      const dataNewEmploye = {
        name,
        sex,
        cpf,
        profileUrl,
        address,
        dateAdmission,
        email,
        role,
        sector,
        status,
        tel,
        wage,
        birth
      }

      const docRef = collection(db, "employes");
      const response = await addDoc(docRef, dataNewEmploye);

      console.log(response)

      toast.success("Funcionário cadastrado com sucesso!");

    } catch (error) {

      toast.error("Erro ao cadastrar Funcionário!");
    } finally {
      setLoading(false);
    }
  }

  function handleActiveButton() {

  }

  return (
    <section className={styles.container}>
      <form onSubmit={(e) => handleAddNewEmploye(e)} >
        {/* Inicio do header do formulário */}
        <section className={styles.headerForm}>
          <section className={styles.areaName}>
            <label>
              Nome:
              <Input
                setValue={(e) => handleChange({ prop: "name", value: e as string })}
                value={dataEmploye.name}
                placeholder="Digite seu nome!"
              />
            </label>
            <section className={styles.areaSex}>
              <p>Sexo:</p>
              <label>
                <input
                  type="radio"
                  name="sex"
                  value={dataEmploye.sex}
                  onChange={() => handleChange({ prop: "sex", value: "masculine" })}
                  checked={dataEmploye.sex === "masculine"}
                />
                Masculino
              </label>
              <label>
                <input
                  type="radio"
                  name="sex"
                  value={dataEmploye.sex}
                  onChange={() => handleChange({ prop: "sex", value: "feminine" })}
                  checked={dataEmploye.sex === "feminine"}
                />
                Feminino
              </label>
            </section>
          </section>
          <section className={styles.areaImgProfile}>
            {dataEmploye.sex === "masculine" ? (
              <img src={AvatarBoy} alt="Avatar" />
            ) : (
              <img src={AvatarGirl} alt="Avatar" />
            )}
            <section className={styles.infoImg}>
              <strong>Foto de Perfil <span>{icons.lightBulb}</span></strong>
              <label className={styles.inputFile}>
                Adicionar Foto
                <span>
                  {icons.arrowUp}
                </span>
                <input type='file' />
              </label>
            </section>
          </section>
        </section>
        {/* Fim do header do formulário */}
        <label>
          Endereço:
          <Input
            setValue={(e) => handleChange({ prop: "address", value: e as string })}
            value={dataEmploye.address}
            placeholder='Digite um endereço'
          />
        </label>
        <section className={styles.formGrid}>
          <label>
            Telefone:
            <Input
              setValue={(e) => handleChange({ prop: "tel", value: e as string })}
              value={dataEmploye.tel}
              placeholder='(xx) xxxxx-xxxx'
            />
          </label>
          <label>
            Email:
            <Input
              setValue={(e) => handleChange({ prop: "email", value: e as string })}
              value={dataEmploye.email}
              placeholder='exemplo@gmail.com'
            />
          </label>
          <label>
            CPF:
            <Input
              setValue={(e) => handleChange({ prop: "cpf", value: e as string })}
              value={dataEmploye.cpf}
              placeholder='Digite um CPF'
            />
          </label>
          <section className={styles.areaDate}>
            <label>
              Data de Nascimento:
              <Input
                setValue={(e) => handleChange({ prop: "birth", value: e as string })}
                type='date'
                value={dataEmploye.birth}
              />
            </label>
            <label>
              Data de Admissão
              <Input
                setValue={(e) => handleChange({ prop: "birth", value: e as string })}
                type='date'
                value={dataEmploye.birth}
              />
            </label>
          </section>
        </section>

        <section className={styles.areaFooterForm}>
          <section className={styles.areaSelect}>
            <section>
              <p>Cargo:</p>
              <select>
                {listRoles.map((role) => (
                  <option key={role.id}>{role.name}</option>
                ))}
              </select>
            </section>

            <section>
              <p>Setor:</p>
              <select>
                {listSectors.map((role) => (
                  <option key={role.id}>{role.name}</option>
                ))}
              </select>
            </section>
          </section>
          <section className={styles.areaSelect}>
            <label className={styles.wage}>
              Salário:
              <Input
                setValue={(e) => handleChange({ prop: "birth", value: e as string })}
                value={dataEmploye.birth}
                placeholder='R$: 00,00'
              />
            </label>
            <Button
              disabled={false}
              loading={loading}
              type='submit'
            >
              Cadastrar
            </Button>
          </section>
        </section>
      </form>
    </section>
  )
}