import { useEffect } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import type { CalendarTriggerInput } from "expo-notifications";
import type { DiaryAgenda } from "./useDiaryAgendas";

export function useDiaryNotifications(agendas: DiaryAgenda[]) {
  // Helper to format hour string
  function horaFormatada(hora: string | undefined | null): { horas: number; minutos: number } | null {
    if (!hora) return null;
    const [horasStr, minutosStr] = hora.split(":");
    const horas = parseInt(horasStr, 10);
    const minutos = parseInt(minutosStr, 10);
    if (Number.isNaN(horas) || Number.isNaN(minutos)) {
      console.error("Formato de hora inválido:", hora);
      return null;
    }
    return { horas, minutos };
  }

  // Check and request notification permissions
  async function verificarNotificacao(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão de notificação",
        "Para receber notificações, ative as permissões de notificação nas configurações do aplicativo.",
      );
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        return false;
      }
    }
    return true;
  }

  // Schedule notifications for all agendas
  async function createNotification() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const agenda of agendas) {
      const horarioValue = (agenda as any).horario || (agenda as any).hora;
      if (!horarioValue) continue;
      const refeicaoValue = (agenda as any).refeicao || (agenda as any).tipo_refeicao || "Refeição";
      const hora = horaFormatada(horarioValue);
      if (!hora) continue;
      try {
        const trigger: CalendarTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hora.horas,
          minute: hora.minutos,
          repeats: true,
        };

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Hora de se alimentar! (${refeicaoValue})`,
            body: "Este é o horário de se alimentar de " + refeicaoValue,
            data: { agendaId: (agenda as any).id, refeicao: refeicaoValue },
          },
          trigger,
        });
      } catch (error) {
        console.error("[NOTIFICATIONS] Erro ao agendar notificação recorrente:", error);
      }
    }
  }

  // Recreate notifications when agendas change
  useEffect(() => {
    if (agendas && agendas.length > 0) {
      (async () => {
        const granted = await verificarNotificacao();
        if (granted) {
          await createNotification();
        }
      })();
    }
  }, [agendas]);

  // Optionally, return helpers for manual notification management
  return {
    limparNotificacaoAgenda: async (agendaId: string) => {
      try {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        for (const notification of scheduledNotifications) {
          if ((notification as any).content?.data?.agendaId === agendaId) {
            await Notifications.cancelScheduledNotificationAsync((notification as any).identifier);
          }
        }
      } catch (error) {
        console.error("[NOTIFICATIONS] Erro ao limpar notificação:", error);
      }
    },
  } as const;
}
