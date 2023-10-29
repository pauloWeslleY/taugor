import styles from "./newEmploye.module.css";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import AvatarGirl from "../../../../assets/avatar-feminino.png";
import AvatarBoy from "../../../../assets/avatar-masculino.png";

import {
  DataNewEmployeData,
  EmployerContext,
} from "../../../../contexts/employerContext";
import { icons } from "../../../../config/icons";
import { Input } from "../../../../components/ui/input/input";
import { Button } from "../../../../components/ui/buttons/button/button";
import { PdfGenerator } from "../../../../components/interface/pdf/indext";
import { db, storage } from "../../../../services/firebaseConnection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { format } from "date-fns";

export function NewEmployer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [dataEmploye, setDataEmploye] = useState<DataNewEmployeData>({
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
    wage: "",
    birth: "",
  });

  const { listRoles, listSectors, listEmployes, setListEmployes } =
    useContext(EmployerContext);

  function handleChange({
    prop,
    value,
  }: {
    prop: string;
    value: string | null;
  }) {
    setDataEmploye({ ...dataEmploye, [prop]: value });
  }

  function validateForm() {
    const {
      name,
      cpf,
      email,
      address,
      tel,
      dateAdmission,
      birth,
      role,
      sector,
      wage,
    } = dataEmploye;
    if (
      name === "" ||
      cpf === "" ||
      email === "" ||
      address === "" ||
      tel === "" ||
      dateAdmission === "" ||
      birth === "" ||
      role === "" ||
      sector === "" ||
      wage === ""
    ) {
      return true;
    }
    return false;
  }

  async function handleAddNewEmploye(e: FormEvent) {
    e.preventDefault();

    const {
      name,
      sex,
      profileUrl,
      cpf,
      email,
      address,
      tel,
      dateAdmission,
      birth,
      role,
      status,
      sector,
      wage,
    } = dataEmploye;

    setLoading(true);
    if (validateForm()) {
      toast.error("Preencha os campos corretamente!");
      setLoading(false);
      return;
    }

    const employeAlredyExist = listEmployes.findIndex(
      (employe) => employe.cpf === cpf
    );

    if (employeAlredyExist !== -1) {
      toast.error("Funcionário já cadastrado!");
      setLoading(false);
      return;
    }

    //validar se o cpf já está cadastrado

    //objeto a ser reutilizado caso o cadastro dê certo

    try {
      const dataNewEmploye = {
        name,
        sex,
        cpf,
        profileUrl: null,
        email,
        address,
        tel,
        dateAdmission: format(new Date(dateAdmission), "dd/MM/yyyy"),
        birth: format(new Date(birth), "dd/MM/yyyy"),
        role,
        status,
        sector,
        wage,
        created_at: new Date(),
      };
      const docRef = collection(db, "employes");
      const response = await addDoc(docRef, dataNewEmploye);
      const newListEmployes = listEmployes;
      newListEmployes.push({
        ...dataNewEmploye,
        id: response.id,
        profileUrl,
      });
      setListEmployes(newListEmployes);

      // enviando imagen de perfil e buscando url para atualizar o doc do funcionário
      if (profileFile) {
        const uploadRef = ref(
          storage,
          `images/${response.id}/${profileFile.name}`
        );

        const imgUrl = await uploadBytes(uploadRef, profileFile);

        const url = await getDownloadURL(imgUrl.ref);

        //atualizando documento adicionando a url que foi gerada pelo banco de dados

        const updateDocRef = doc(db, "employes", response.id);
        const employeUpdate = await updateDoc(updateDocRef, {
          profileUrl: url,
        });
      }
      toast.success("Funcionário cadastrado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar Funcionário!");
    } finally {
      setLoading(false);
    }
  }

  function handleChangeImg(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      // aceitando apenas imagens em png ou jpeg
      if (file.type === "image/jpeg" || file.type === "image/png") {
        // criando uma url local para exibir a foto que o usuário escolheu
        handleChange({ prop: "profileUrl", value: URL.createObjectURL(file) });
        setProfileFile(file);
      } else {
        toast.error("Escolha uma imagen no formato JPEG ou PNG");
        return;
      }
    }
  }

  function handleRemoveImg() {
    handleChange({ prop: "profileUrl", value: null });
    setProfileFile(null);
  }

  // function handleActiveButton() {}

  return (
    <section className={styles.container}>
      <form onSubmit={(e) => handleAddNewEmploye(e)}>
        {/* Inicio do header do formulário */}
        <section className={styles.headerForm}>
          <section className={styles.areaName}>
            <label>
              Nome:
              <Input
                setValue={(e) =>
                  handleChange({ prop: "name", value: e as string })
                }
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
                  onChange={() =>
                    handleChange({ prop: "sex", value: "masculine" })
                  }
                  checked={dataEmploye.sex === "masculine"}
                />
                Masculino
              </label>
              <label>
                <input
                  type="radio"
                  name="sex"
                  value={dataEmploye.sex}
                  onChange={() =>
                    handleChange({ prop: "sex", value: "feminine" })
                  }
                  checked={dataEmploye?.sex === "feminine"}
                />
                Feminino
              </label>
            </section>
          </section>
          <section className={styles.areaImgProfile}>
            {/* Verificando se o usuário colocou uma foto e caso não tenha colocado a segunda verificação é para retornar um avatar masculino ou feminino */}
            {dataEmploye?.profileUrl ? (
              <img src={dataEmploye?.profileUrl} alt="Avatar" />
            ) : dataEmploye.sex === "masculine" ? (
              <img src={AvatarBoy} alt="Avatar" />
            ) : (
              <img src={AvatarGirl} alt="Avatar" />
            )}
            <section className={styles.infoImg}>
              <strong>
                Foto de Perfil <span>{icons.lightBulb}</span>
              </strong>
              <label className={styles.inputFile}>
                {dataEmploye?.profileUrl ? "Alterar" : "Adicionar"} Foto
                <span>{icons.arrowUp}</span>
                <input type="file" onChange={(e) => handleChangeImg(e)} />
              </label>
              {dataEmploye?.profileUrl && (
                <Button
                  disabled={!dataEmploye?.profileUrl}
                  loading={false}
                  type="button"
                  onClick={handleRemoveImg}
                >
                  Remover Foto
                </Button>
              )}
            </section>
          </section>
        </section>
        {/* Fim do header do formulário */}
        <label>
          Endereço:
          <Input
            setValue={(e) =>
              handleChange({ prop: "address", value: e as string })
            }
            value={dataEmploye.address}
            placeholder="Digite um endereço"
          />
        </label>
        <section className={styles.formGrid}>
          <label>
            Telefone:
            <Input
              setValue={(e) =>
                handleChange({ prop: "tel", value: e as string })
              }
              value={dataEmploye.tel}
              placeholder="(xx) xxxxx-xxxx"
            />
          </label>
          <label>
            Email:
            <Input
              setValue={(e) =>
                handleChange({ prop: "email", value: e as string })
              }
              value={dataEmploye.email}
              placeholder="exemplo@gmail.com"
            />
          </label>
          <label>
            CPF:
            <Input
              setValue={(e) =>
                handleChange({ prop: "cpf", value: e as string })
              }
              value={dataEmploye.cpf}
              placeholder="Digite um CPF"
            />
          </label>
          <section className={styles.areaDate}>
            <label>
              Data de Nascimento:
              <Input
                setValue={(e) =>
                  handleChange({ prop: "birth", value: e as string })
                }
                type="date"
                value={dataEmploye.birth}
              />
            </label>
            <label>
              Data de Admissão
              <Input
                setValue={(e) =>
                  handleChange({ prop: "dateAdmission", value: e as string })
                }
                type="date"
                value={dataEmploye.dateAdmission}
              />
            </label>
          </section>
        </section>

        <section className={styles.areaFooterForm}>
          <section className={styles.areaSelect}>
            <section>
              <p>Cargo:</p>
              <select
                onChange={(e) =>
                  handleChange({ prop: "role", value: e.target.value })
                }
              >
                <option value={""}>Cargos</option>
                {listRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </section>

            <section>
              <p>Setor:</p>
              <select
                onChange={(e) =>
                  handleChange({ prop: "sector", value: e.target.value })
                }
              >
                <option value={""}>Setores</option>
                {listSectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </section>
          </section>
          <section className={styles.areaSelect}>
            <label className={styles.wage}>
              Salário:
              <Input
                setValue={(e) =>
                  handleChange({ prop: "wage", value: e as string })
                }
                value={dataEmploye.wage}
                placeholder="R$: 00,00"
              />
            </label>
            <Button disabled={validateForm()} loading={loading} type="submit">
              Cadastrar
            </Button>
          </section>
        </section>
      </form>
      <section className={styles.areaPdf}>
        <PdfGenerator data={dataEmploye} />
      </section>
    </section>
  );
}
