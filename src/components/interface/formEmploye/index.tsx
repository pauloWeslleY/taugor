import styles from "./form.module.css";
import {
  DataEmploye,
  EmployerContext,
} from "../../../contexts/employerContext";
import { Input } from "../../ui/input/input";

import AvatarBoy from "../../../assets/avatar-masculino.png";
import AvatarGirl from "../../../assets/avatar-feminino.png";
import { icons } from "../../../config/icons";
import { Button } from "../../ui/buttons/button/button";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { PdfGenerator } from "../pdf/indext";
import { Modal } from "../modal";
import { toast } from "react-toastify";

interface FormEmployeProps {
  currentDataEmploye: DataEmploye;
  handleSubmit: (e: any) => Promise<void>;
  action: "edit" | "new";
}

interface ChangeDataEmploye {
  prop: string;
  value: string | null;
}

export function FormEmploye({
  currentDataEmploye,
  handleSubmit,
  action,
}: FormEmployeProps) {
  const [dataEmploye, setDataEmploye] =
    useState<DataEmploye>(currentDataEmploye);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [profileFile, setProfileFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { listRoles, listSectors } = useContext(EmployerContext);

  function handleChange({ prop, value }: ChangeDataEmploye) {
    setDataEmploye({ ...dataEmploye, [prop]: value });
    if (action === "edit") {
      handleValidate();
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

  // validando se o usuário esta cadastrando ou editando um novo functionário
  // para poder validar se foi feita alguma alteração nos valores já existentes
  function handleValidate() {
    if (action === "edit") {
      if (currentDataEmploye === dataEmploye) {
        return true;
      } else {
        return false;
      }
    } else {
      // desconstruindo os dados para validação
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
  }

  function handleCloseModalPdf() {
    setModalVisible(false);
  }

  async function handleSubmitForm(e: FormEvent) {
    setLoading(true);
    e.preventDefault();
    await handleSubmit({ dataEmploye, file: profileFile });
    setLoading(false);
  }

  return (
    <section className={styles.container}>
      <form onSubmit={(e) => handleSubmitForm(e)}>
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
            ) : (
              <img
                src={dataEmploye.sex === "masculine" ? AvatarBoy : AvatarGirl}
                alt="Avatar"
              />
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
        <section className={styles.areaStatusEmploye}>
          <p>
            Status:{" "}
            <span>
              {dataEmploye.status === "active" && "ATIVO"}
              {dataEmploye.status === "fired" && "DEMITIDO"}
              {dataEmploye.status === "end_of_contract" &&
                "CONTRATO FINALIZADO"}
            </span>
          </p>
          {dataEmploye?.status !== "active" ? (
            <Button loading={false} disabled={false}>
              Ativar Funcionário
            </Button>
          ) : (
            <>
              <Button
                loading={false}
                disabled={false}
                style={{
                  background: "#df5050",
                }}
              >
                Demitir Funcionário
              </Button>
              <Button 
              loading={false} 
              disabled={false}
              style={{
                background: "#df5050",
              }}
              >
                Finalizar Contrato
              </Button>
            </>
          )}
        </section>

        <section className={styles.areaFooterForm}>
          <section className={styles.areaSelect}>
            <section>
              <p>Cargo:</p>
              <select
                value={dataEmploye.role}
                onChange={(e) =>
                  handleChange({ prop: "role", value: e.target.value })
                }
              >
                <option value={""} key={0}>
                  CARGOS
                </option>
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
                <option value={""} key={0}>
                  SETORES
                </option>
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
                value={dataEmploye?.wage}
                placeholder="R$: 00,00"
              />
            </label>
            <Button disabled={handleValidate()} loading={loading} type="submit">
              {action === "edit" ? "Editar" : "Cadastrar"}
            </Button>
          </section>
        </section>

        <section className={styles.areaButtonPdf}>
          <Button
            loading={false}
            disabled={false}
            type="button"
            onClick={() => setModalVisible(true)}
            style={{
              marginTop: 20,
            }}
          >
            Gerar PDF
          </Button>
        </section>
      </form>
      <section className={styles.areaPdf}>
        <PdfGenerator data={dataEmploye} action="edit" />
      </section>

      {modalVisible && (
        <Modal title="Documento PDF" handleClose={handleCloseModalPdf}>
          <section className={styles.areaPdfGenerator}>
            <PdfGenerator data={dataEmploye} action="edit" />
          </section>
        </Modal>
      )}
    </section>
  );
}
