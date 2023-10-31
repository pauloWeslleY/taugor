import styles from "./form.module.css";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

import { PdfGenerator } from "../pdf/indext";
import { Modal } from "../modal";
import { Input } from "../../ui/input/input";
import { Button } from "../../ui/buttons/button/button";
import {
  DataEmploye,
  EmployerContext,
  Status,
} from "../../../contexts/employerContext";

import AvatarBoy from "../../../assets/avatar-masculino.png";
import AvatarGirl from "../../../assets/avatar-feminino.png";
import { icons } from "../../../config/icons";

export interface HandleChangeStatusProps {
  action: Status;
  dataEmploye: DataEmploye;
}

interface FormEmployeProps {
  currentDataEmploye?: DataEmploye;
  handleSubmit: (e: any) => Promise<void>;
  action: "edit" | "new";
  handlechangeStatus?: ({
    action,
    dataEmploye,
  }: HandleChangeStatusProps) => Promise<void>;
}

interface ChangeDataEmploye {
  prop: string;
  value: string | null;
}

export function FormEmploye({
  handlechangeStatus,
  currentDataEmploye,
  handleSubmit,
  action,
}: FormEmployeProps) {
  const resetDataEmploye: DataEmploye = {
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
  };
  const [dataEmploye, setDataEmploye] = useState<DataEmploye>(
    currentDataEmploye ? currentDataEmploye : resetDataEmploye
  );
  const [profileFile, setProfileFile] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUpdateStatus, setLoadingUpdateStatus] =
    useState<boolean>(false);
  const { listRoles, listSectors } = useContext(EmployerContext);

  function handleChange({ prop, value }: ChangeDataEmploye) {
    const number = value?.replace(/\D/g, "");

    if (prop === "tel") {
      const telFormat = number?.replace(
        /(\d{2})(\d{4,5})(\d{4})/,
        "($1) $2-$3"
      );

      if (telFormat?.length! > 15 && value !== " ") {
        return;
      }

      setDataEmploye({ ...dataEmploye, tel: telFormat! });
      return;
    }
    if (prop === "cpf") {
      const cpfFormat = number?.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );

      if (cpfFormat?.length! > 14 && value !== " ") {
        return;
      }

      setDataEmploye({ ...dataEmploye, cpf: cpfFormat! });
      return;
    }
    if (prop === "wage") {
      const formatNumber = value?.replace(/[^0-9.]/g, "");
      const wage = formatNumber!;

      setDataEmploye({ ...dataEmploye, wage: wage });
      return;
    }

    setDataEmploye({ ...dataEmploye, [prop]: value });
    if (action === "edit") {
      handleValidate();
    }
  }
  function handleChangeImg(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
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

  function handleValidate() {
    if (action === "edit") {
      if (currentDataEmploye === dataEmploye) {
        return true;
      } else {
        return false;
      }
    } else {
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
        cpf.length < 14 ||
        email === "" ||
        address === "" ||
        tel.length < 15 ||
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
    setDataEmploye(resetDataEmploye);
    setLoading(false);
  }

  async function handleStatus(action: Status) {
    if (handlechangeStatus) {
      setLoadingUpdateStatus(true);
      await handlechangeStatus({ action, dataEmploye });
      setLoadingUpdateStatus(false);
    }
  }

  return (
    <section className={styles.container}>
      <form onSubmit={(e) => handleSubmitForm(e)}>
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
                <input
                  accept=".png, .jpeg, .jpg"
                  type="file"
                  onChange={(e) => handleChangeImg(e)}
                />
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
              type="tel"
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
              type="email"
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
                value={dataEmploye?.birth}
              />
            </label>
            <label>
              Data de Admissão
              <Input
                setValue={(e) =>
                  handleChange({ prop: "dateAdmission", value: e as string })
                }
                type="date"
                value={dataEmploye?.dateAdmission}
              />
            </label>
          </section>
        </section>

        {action === "edit" && (
          <section className={styles.areaStatusEmploye}>
            <p>
              Status:{" "}
              <span>
                {dataEmploye?.status === "active" && "ATIVO"}
                {dataEmploye?.status === "fired" && "DEMITIDO"}
                {dataEmploye?.status === "end_of_contract" &&
                  "CONTRATO FINALIZADO"}
              </span>
            </p>
            {dataEmploye?.status !== "active" ? (
              <Button
                loading={loadingUpdateStatus}
                disabled={false}
                type="button"
                onClick={() => handleStatus("active")}
              >
                Ativar Funcionário
              </Button>
            ) : (
              <>
                <Button
                  loading={loadingUpdateStatus}
                  disabled={false}
                  type="button"
                  style={{
                    background: "#df5050",
                  }}
                  onClick={() => handleStatus("fired")}
                >
                  Demitir Funcionário
                </Button>
                <Button
                  loading={loadingUpdateStatus}
                  disabled={false}
                  style={{
                    background: "#df5050",
                  }}
                  type="button"
                  onClick={() => handleStatus("end_of_contract")}
                >
                  Finalizar Contrato
                </Button>
              </>
            )}
          </section>
        )}

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
                value={dataEmploye?.sector}
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
                type="numbe"
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
