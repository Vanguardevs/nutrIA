import React from "react";
import { SafeAreaView, View, ImageBackground, useColorScheme, ScrollView, Dimensions } from "react-native";
import DiaryAgendaList from "../../../components/alarm/DiaryAgendaList";
import EmptyDiaryState from "../../../components/alarm/EmptyDiaryState";
import { useNavigation } from "@react-navigation/native";
import { getDatabase, ref, update } from "firebase/database";
import { auth } from "../../../database/firebase";
import FabCreateDiary from "../../../components/alarm/FabCreateDiary";
import styles from "../../../theme/styles/diary";
import { useDiaryAgendas } from "../../../hooks/diary/useDiaryAgendas";
import { useDiaryNotifications } from "../../../hooks/diary/useDiaryNotifications";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08);

export default function Diary() {
  const colorScheme = useColorScheme();
  const backgroundH = colorScheme === "dark" ? "#1C1C1E" : "#F2F2F2";
  const navigate = useNavigation<any>();
  const { agendas } = useDiaryAgendas();
  useDiaryNotifications(agendas);

  async function AgendaConcluida(id: string) {
    const userID = auth.currentUser?.uid;
    const db = getDatabase();
    const data = new Date();
    const dia = data.getDay();
    const reference = ref(db, `users/${userID}/diaries/${id}/progress/`);
    update(reference, {
      [dia]: true,
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundH }]}>
      <ImageBackground
        source={require("../../../../assets/Frutas_home.png")}
        style={styles.homeBackground}
        resizeMode="cover"
      >
        <View style={styles.fabTopContainer}>
          <FabCreateDiary onPress={() => navigate.navigate("CreateDiary" as never)} />
        </View>

        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: TAB_BAR_HEIGHT + 16,
                minHeight: agendas.length === 0 ? SCREEN_HEIGHT * 0.7 : undefined,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {agendas.length > 0 ? (
              <DiaryAgendaList
                agendas={agendas as any}
                onEdit={(agenda: any) => {
                  navigate.navigate(
                    "EditDiary" as never,
                    {
                      id: agenda.id,
                      alimentos: Array.isArray(agenda.alimentos)
                        ? agenda.alimentos
                        : agenda.refeicao
                        ? [agenda.refeicao]
                        : [],
                      hora: agenda.horario || agenda.hora,
                    } as never,
                  );
                }}
                onConcluido={AgendaConcluida}
              />
            ) : (
              <EmptyDiaryState />
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
