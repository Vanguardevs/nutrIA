
import { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

export function useDiaryNotifications(agendas) {
	// Helper to format hour string
	function horaFormatada(hora) {
		const [horas, minutos] = hora.split(':').map((item) => parseInt(item, 10));
		if (isNaN(horas) || isNaN(minutos)) {
			console.error('Formato de hora inválido:', hora);
			return null;
		}
		return { horas, minutos };
	}

	// Check and request notification permissions
	async function verificarNotificacao() {
		const { status } = await Notifications.getPermissionsAsync();
		if (status !== 'granted') {
			Alert.alert(
				'Permissão de notificação',
				'Para receber notificações, ative as permissões de notificação nas configurações do aplicativo.'
			);
			const { status: newStatus } = await Notifications.requestPermissionsAsync();
			if (newStatus !== 'granted') {
				return false;
			}
		}
		return true;
	}

	// Schedule notifications for all agendas
	async function createNotification() {
		await Notifications.cancelAllScheduledNotificationsAsync();
		for (const agenda of agendas) {
			const horarioValue = agenda.horario || agenda.hora;
			if (!horarioValue) continue;
			const refeicaoValue = agenda.refeicao || agenda.tipo_refeicao || 'Refeição';
			const hora = horaFormatada(horarioValue);
			if (!hora) continue;
			try {
				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Hora de se alimentar! (${refeicaoValue})`,
						body: 'Este é o horário de se alimentar de ' + refeicaoValue,
						data: { agendaId: agenda.id, refeicao: refeicaoValue },
					},
					trigger: {
						hour: hora.horas,
						minute: hora.minutos,
						repeats: true,
					},
				});
			} catch (error) {
				console.error('[NOTIFICATIONS] Erro ao agendar notificação recorrente:', error);
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
		limparNotificacaoAgenda: async (agendaId) => {
			try {
				const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
				for (const notification of scheduledNotifications) {
					if (notification.content.data?.agendaId === agendaId) {
						await Notifications.cancelScheduledNotificationAsync(notification.identifier);
					}
				}
			} catch (error) {
				console.error('[NOTIFICATIONS] Erro ao limpar notificação:', error);
			}
		},
	};
}
