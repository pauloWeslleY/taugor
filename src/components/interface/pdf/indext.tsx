import {
  PDFViewer,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import { DataNewEmployeData } from "../../../contexts/employerContext";

interface PdfProps {
  data: DataNewEmployeData;
}

export function PdfGenerator({ data }: PdfProps) {
  console.log(data);
  return (
    <PDFViewer>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>titulo</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
  },
});
