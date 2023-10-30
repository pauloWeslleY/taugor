import styles from "./newEmploye.module.css";
import { useContext } from "react";
import { toast } from "react-toastify";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

import { EmployerContext } from "../../../../contexts/employerContext";
import { db, storage } from "../../../../services/firebaseConnection";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FormEmploye } from "../../../../components/interface/formEmploye";

export function NewEmployer() {
  const { listEmployes, setListEmployes } = useContext(EmployerContext);

  async function handleAddNewEmploye({ dataEmploye, file }: any) {
    const { profileUrl, ...rest } = dataEmploye;

    const employeAlredyExist = listEmployes.findIndex(
      (employe) => employe.cpf === dataEmploye.cpf
    );

    if (employeAlredyExist !== -1) {
      toast.error("Funcionário já cadastrado!");
      return;
    }

    try {
      const dataNewEmploye = {
        profileUrl: null,
        created_at: new Date(),
        ...rest,
      };
      const docRef = collection(db, "employes");
      const response = await addDoc(docRef, dataNewEmploye);
      const newListEmployes = listEmployes;
      newListEmployes.push({
        ...dataNewEmploye,
        id: response.id,
        profileUrl,
      });

      if (file) {
        const uploadRef = ref(storage, `images/${response.id}/${file.name}`);

        const imgUrl = await uploadBytes(uploadRef, file);

        const url = await getDownloadURL(imgUrl.ref);

        const updateDocRef = doc(db, "employes", response.id);
        const employeUpdate = await updateDoc(updateDocRef, {
          profileUrl: url,
        });
      }
      setListEmployes(newListEmployes);
      toast.success("Funcionário cadastrado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar Funcionário!");
    }
  }

  return (
    <section className={styles.container}>
      <FormEmploye handleSubmit={handleAddNewEmploye} action="new" />
    </section>
  );
}
