import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import CustomButton from "../../../components/shared/CustomButton";
import { LineChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../database/firebase";
import { getDatabase, ref, onValue } from "firebase/database";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08);

export default function Progress() {
  const colorScheme = useColorScheme();

  const backgroundH = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const textColor = colorScheme === "dark" ? "#fff" : "#000";
  const cardBackground = colorScheme === "dark" ? "#2c2c2e" : "#fff";
  const lineColor = colorScheme === "dark" ? "rgba(134, 65, 244, 0.8)" : "#6a1b9a";

  const navigate = useNavigation<any>();

  const [comidos, setComidos] = useState<string[]>([]);
  const [naoComidos, setNaoComidos] = useState<string[]>([]);
  const [quantidadePorDia, setQuantidadePorDia] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser?.uid;
    const diariesRef = ref(db, `users/${userId}/diaries`);

    const unsubscribe = onValue(diariesRef, (snapshot) => {
      const data = snapshot.val();

      if (data && typeof data === "object") {
        const listaAgendas = Object.entries<any>(data).map(([key, value]) => ({
          id: key,
          ...(value as any),
        }));

        const progressoPorDia = Array(7).fill(0) as number[];
        const diaHoje = new Date().getDay();
        const comidosTemp: string[] = [];
        const naoComidosTemp: string[] = [];

        listaAgendas.forEach((agenda: any) => {
          if (agenda.progress && Array.isArray(agenda.progress)) {
            agenda.progress.forEach((feito: boolean, dia: number) => {
              if (feito === true) {
                progressoPorDia[dia] += 1;
              }
            });

            const alimentos = Array.isArray(agenda.alimentos)
              ? agenda.alimentos
              : agenda.refeicao
              ? [agenda.refeicao]
              : [];
            if (agenda.progress[diaHoje] === true) {
              comidosTemp.push(...alimentos);
            } else {
              naoComidosTemp.push(...alimentos);
            }
          }
        });

        setComidos(comidosTemp);
        setNaoComidos(naoComidosTemp);
        setQuantidadePorDia(progressoPorDia);
      } else {
        setQuantidadePorDia(Array(7).fill(0));
        setComidos([]);
        setNaoComidos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const screenWidth = Dimensions.get("window").width;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
      <ImageBackground
        source={require("../../../../assets/Frutas_home.png")}
        style={styles.homeBackground}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: TAB_BAR_HEIGHT + 16,
              minHeight: comidos.length + naoComidos.length === 0 ? SCREEN_HEIGHT * 0.7 : undefined,
            },
          ]}
        >
          <Text style={[styles.title, { color: textColor }]}>📊 Gráfico Nutricional</Text>

          <View style={[styles.chartSection, styles.card, { backgroundColor: cardBackground }]}>
            <LineChart
              data={{
                labels: days,
                datasets: [
                  {
                    data: quantidadePorDia as any,
                    color: () => lineColor as any,
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 72}
              height={220}
              chartConfig={
                {
                  backgroundColor: backgroundH as any,
                  backgroundGradientFrom: backgroundH as any,
                  backgroundGradientTo: backgroundH as any,
                  decimalPlaces: 0,
                  color: () => textColor as any,
                  labelColor: () => textColor as any,
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: lineColor,
                  },
                } as any
              }
              bezier
              style={{ borderRadius: 16 }}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <CustomButton
              title="Ver Resumo Diário"
              onPress={() => navigate.navigate("ResumoDiario", { comidos, naoComidos })}
              modeButton={true}
              size="large"
              style={{ width: "100%" }}
            />
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="check-box" size={24} color="green" />
              <Text style={[styles.sectionTitle, { color: textColor }]}>Refeições Realizadas</Text>
            </View>
            {comidos.map((alimento, index) => (
              <Text key={index} style={[styles.item, { color: textColor }]}>
                • {alimento}
              </Text>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="cancel" size={24} color="red" />
              <Text style={[styles.sectionTitle, { color: textColor }]}>Refeições Não Realizadas</Text>
            </View>
            {naoComidos.map((alimento, index) => (
              <Text key={index} style={[styles.item, { color: textColor }]}>
                • {alimento}
              </Text>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  homeBackground: { flex: 1, width: "100%", height: "100%" },
  scrollContent: { alignItems: "center", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", alignSelf: "flex-start", marginBottom: 20 },
  chartSection: { width: "100%", alignItems: "center", padding: 16, borderRadius: 16, marginBottom: 20 },
  buttonWrapper: { marginVertical: 10, width: "100%", alignItems: "center" },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginLeft: 8 },
  item: { fontSize: 16, marginLeft: 8, marginBottom: 6 },
});
