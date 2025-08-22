import { useEffect } from 'react';
import { Alert } from 'react-native';
import notifee, { AuthorizationStatus, TriggerType, RepeatFrequency } from '@notifee/react-native';
import type { TimestampTrigger } from '@notifee/react-native';

export function useDiaryNotifications(agendas: any[]) {
  // Formatação da hora
  function horaFormatada(hora?: string | null) {
    if (!hora) return null;
    const [horasStr, minutosStr] = hora.split(':');
    const horas = parseInt(horasStr, 10);
    const minutos = parseInt(minutosStr, 10);
    if (Number.isNaN(horas) || Number.isNaN(minutos)) {
      console.error('Formato de hora inválido:', hora);
      return null;
    }
    return { horas, minutos };
  }

  // Verificar permissões de notificação
  async function verificarNotificacao() {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      Alert.alert(
        'Permissão de notificação',
        'Para receber notificações, ative as permissões de notificação nas configurações do aplicativo.'
      );
      return false;
    }
    return true;
  }

  // Criar notificações
  async function createNotification() {
    // Cancela todas as notificações existentes
    await notifee.cancelAllNotifications();

    for (const agenda of agendas) {
      const horarioValue = agenda.horario || agenda.hora;
      if (!horarioValue) continue;

      const refeicaoValue = agenda.refeicao || agenda.tipo_refeicao || 'Refeição';
      const hora = horaFormatada(horarioValue);
      if (!hora) continue;

      try {
        const now = new Date();
        const triggerTimestamp = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hora.horas,
          hora.minutos,
          0,
          0
        ).getTime();

        const trigger: TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerTimestamp,
          repeatFrequency: RepeatFrequency.DAILY,
        };

        await notifee.createTriggerNotification(
          {
            title: `Hora de se alimentar! (${refeicaoValue})`,
            body: `Este é o horário de se alimentar de ${refeicaoValue}`,
            data: { agendaId: agenda.id, refeicao: refeicaoValue },
          },
          trigger
        );
      } catch (error) {
        console.error('[NOTIFICATIONS] Erro ao agendar notificação recorrente:', error);
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
        console.error('[NOTIFICATIONS] Erro ao limpar notificação:', error);
      }
    },
  } as const;
}
