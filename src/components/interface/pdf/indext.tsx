import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  DataEmploye,
  EmployerContext,
} from "../../../contexts/employerContext";
import { format } from "date-fns";
import { handleRenderRoleOrSector } from "../../../utils";
import { useContext } from "react";

interface PdfProps {
  data: DataEmploye;
  action: "edit" | "new";
}

export function PdfGenerator({ data, action }: PdfProps) {
  const { listRoles, listSectors } = useContext(EmployerContext);

  return (
    <PDFViewer style={styles.container}>
      <Document style={styles.document}>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Dados Do Funcionário</Text>
          <Text style={styles.subTitle}>Informações de Contato</Text>

          <View style={styles.areaInfo}>
            <Text>Nome: {data?.name}</Text>
            <Text>Email: {data?.email}</Text>
            <Text>Tel: {data?.tel}</Text>
            <Text>CPF: {data?.cpf}</Text>
            <Text>
              Sexo: {data?.sex === "masculine" ? "Masculino" : "Feminino"}
            </Text>
            <Text>Data de Nascimento: {data?.birth}</Text>
            <Text>Endereço: {data?.address}</Text>
          </View>

          <Text style={styles.subTitle}>Informações de Trabalho </Text>
          <View style={styles.areaInfo}>
            {action === "edit" ? (
              <>
                <Text>
                  Cargo:{" "}
                  {handleRenderRoleOrSector({
                    id: data?.role,
                    list: listRoles,
                  })}
                </Text>
                <Text>
                  Setor:{" "}
                  {handleRenderRoleOrSector({
                    id: data?.sector,
                    list: listSectors,
                  })}
                </Text>
              </>
            ) : (
              <>
                <Text>Cargo: {data?.role}</Text>
                <Text>Setor: {data?.sector}</Text>
              </>
            )}
            <Text>Data de Admissão: {data?.dateAdmission}</Text>
            <Text>Salário: R$ {data?.wage}</Text>
          </View>

          <View style={styles.footerPdf}>
            <Text>
              {action === "edit"
                ? "Documento editado em:"
                : "Documento criado em:"}{" "}
              {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  document: {},
  page: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  subTitle: {
    marginBottom: 10,
    fontWeight: "bold",
    borderBottom: "2px solid #000",
  },
  areaInfo: {
    gap: 5,
    marginBottom: 20,
  },
  footerPdf: {
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
});
