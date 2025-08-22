import { useEffect } from "react";
import { Alert } from "react-native";
import notifee, {
  TriggerType,
  RepeatFrequency,
  TimestampTrigger,
} from "@notifee/react-native";

// Em algumas versões o AuthorizationStatus não está exportado direto.
// Podemos tratar como número (0 = DENIED, 1 = AUTHORIZED).
const AUTHORIZED = 1;

export function useDiaryNotifications(agendas: any[]) {
  // Formatação da hora
  function horaFormatada(hora?: string | null) {
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

  // Verificar permissões de notificação
  async function verificarNotificacao() {
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus < AUTHORIZED) {
      Alert.alert(
        "Permissão de notificação",
        "Para receber notificações, ative as permissões de notificação nas configurações do aplicativo."
      );
      return false;
    }
    return true;
  }

  // Criar notificações
  async function createNotification() {
    await notifee.cancelAllNotifications();
  
    for (const agenda of agendas) {
      const horarioValue = agenda.horario || agenda.hora;
      if (!horarioValue) continue;
  
      const refeicaoValue = agenda.refeicao || agenda.tipo_refeicao || "Refeição";
      const hora = horaFormatada(horarioValue);
      if (!hora) continue;
  
      try {
        const now = new Date();
        const triggerDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hora.horas,
          hora.minutos,
          0,
          0
        );
  
        if (triggerDate.getTime() <= Date.now()) {
          triggerDate.setDate(triggerDate.getDate() + 1); // se horário já passou, agenda para amanhã
        }
  
        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerDate.getTime(),
          repeatFrequency: RepeatFrequency.DAILY,
        };
  
        console.log("Agendando notificação:", triggerDate.toString());
  
        await notifee.createTriggerNotification(
          {
            title: `Hora de se alimentar! (${refeicaoValue})`,
            body: `Este é o horário de se alimentar de ${refeicaoValue}`,
            data: { agendaId: agenda.id, refeicao: refeicaoValue },
          },
          trigger
        );
      } catch (error) {
        console.error("[NOTIFICATIONS] Erro ao agendar notificação:", error);
      }
    }
  }  

  // Recriar notificações quando as agendas mudam
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

  // Função para limpar notificações de uma agenda específica
  return {
    limparNotificacaoAgenda: async (agendaId: string) => {
      try {
        const notifications = await notifee.getDisplayedNotifications();
        for (const { notification } of notifications) {
          if (notification.data?.agendaId === agendaId) {
            await notifee.cancelNotification(notification.id);
          }
        }
      } catch (error) {
        console.error("[NOTIFICATIONS] Erro ao limpar notificação:", error);
      }
    },
  } as const;
}
