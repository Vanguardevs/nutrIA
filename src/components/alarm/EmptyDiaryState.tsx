
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EmptyDiaryStateProps {
	mainText?: string;
	subText?: string;
}

const EmptyDiaryState: React.FC<EmptyDiaryStateProps> = ({
	mainText = 'Nenhuma agenda para hoje',
	subText = 'Crie uma nova agenda para começar',
}) => {
	return (
		<View style={styles.emptyContainer}>
			<Ionicons name="calendar-outline" size={64} color="#C7C7CC" />
			<Text style={styles.emptyText}>{mainText}</Text>
			<Text style={styles.emptySubText}>{subText}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
		marginTop: 100,
	},
	emptyText: {
		fontSize: 20,
		fontWeight: '600',
		color: '#8E8E93',
		marginTop: 16,
		textAlign: 'center',
	},
	emptySubText: {
		fontSize: 16,
		color: '#C7C7CC',
		marginTop: 8,
		textAlign: 'center',
		lineHeight: 22,
	},
});

export default EmptyDiaryState;
