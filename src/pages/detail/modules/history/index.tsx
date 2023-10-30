import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDocs } from "firebase/firestore";

import { db } from "../../../../services/firebaseConnection";
import {
  EmployerContext,
  ListDataEmploye,
} from "../../../../contexts/employerContext";
import { CardDetailEmploye } from "../../../../components/interface/cardDetailEmploye";
import { Title } from "../../../../components/ui/title";

export function HistoryEmploye() {
  const { id } = useParams();
  const { setListHistory, listHistory } = useContext(EmployerContext);
  useEffect(() => {
    setListHistory([]);
    async function loadHistory() {
      try {
        const docRef = collection(doc(db, "employes", id!), "history");
        const response = await getDocs(docRef);

        let list: ListDataEmploye = [];
        response.forEach((history) => {
          list.push({
            id: history.id,
            name: history.data().name,
            email: history.data().email,
            cpf: history.data().cpf,
            birth: history.data().birth,
            address: history.data().address,
            profileUrl: history.data().profileUrl,
            role: history.data().role,
            sector: history.data().sector,
            sex: history.data().sex,
            status: history.data().status,
            tel: history.data().tel,
            wage: history.data().wage,
            dateAdmission: history.data().dateAdmission,
            created_at: history.data().created_at,
          });
        });
        setListHistory(list);
      } catch (error) {}
    }
    loadHistory();

    return () => {
      setListHistory([]);
    };
  }, []);

  return (
    <section>
      <Title
        title={
          listHistory.length > 0
            ? "Histórico do Funcionário"
            : "Funcionário Não Possuí Histórico"
        }
      />
      {listHistory.length > 0 &&
        listHistory.map((history) => (
          <CardDetailEmploye
            data={history}
            action="history"
            key={history?.id}
          />
        ))}
    </section>
  );
}
