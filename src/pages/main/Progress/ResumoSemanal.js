import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Math.round(SCREEN_HEIGHT * 0.08); // 8% da tela, igual ao appRoute.js

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Retorna o nome do dia da semana
function getDayName(date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'long' });
}

// Datas da semana atual 
function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Domingo) até 6 (Sábado)
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
}

export default function ResumoSemanal() {
  const [dadosSemana, setDadosSemana] = useState([]);

  useEffect(() => {
    const semana = getCurrentWeekDates();

    // Simula dados aleatórios
    const exemploDados = semana.map((date) => ({
      dia: `${capitalize(getDayName(date))} - ${date.toLocaleDateString('pt-BR')}`,
      calorias: Math.floor(Math.random() * 500) + 1500,           // 1500–2000 kcal
      valorEnergetico: Math.floor(Math.random() * 100) + 300,     // 300–400 kJ
      comidos: Math.floor(Math.random() * 10) + 5,                // 5–14
      naoComidos: Math.floor(Math.random() * 5),                  // 0–4
    }));

    setDadosSemana(exemploDados);
  }, []);

  // Cálculo dos totais semanais
  const totalCalorias = dadosSemana.reduce((acc, curr) => acc + curr.calorias, 0);
  const totalValorEnergetico = dadosSemana.reduce((acc, curr) => acc + curr.valorEnergetico, 0);
  const totalComidos = dadosSemana.reduce((acc, curr) => acc + curr.comidos, 0);
  const totalNaoComidos = dadosSemana.reduce((acc, curr) => acc + curr.naoComidos, 0);

  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      {
        paddingBottom: TAB_BAR_HEIGHT + 16,
        minHeight: dadosSemana.length === 0 ? SCREEN_HEIGHT * 0.7 : undefined
      }
    ]}>
      <Text style={styles.title}>Resumo Semanal</Text>

      {dadosSemana.map((diaData, index) => (
        <View key={index} style={styles.diaContainer}>
          <Text style={styles.diaNome}>{diaData.dia}</Text>
          <Text>Calorias: {diaData.calorias} kcal</Text>
          <Text>Valor Energético: {diaData.valorEnergetico} kJ</Text>
          <Text>Refeições Realizadas: {diaData.comidos}</Text>
          <Text>Refeições Não Realizadas: {diaData.naoComidos}</Text>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Totais Semanais</Text>
        <Text>Calorias Totais: {totalCalorias} kcal</Text>
        <Text>Valor Energético Total: {totalValorEnergetico} kJ</Text>
        <Text>Total Refeições Realizadas: {totalComidos}</Text>
        <Text>Total Refeições Não Realizadas: {totalNaoComidos}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  diaContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#e0f2f1',
    borderRadius: 8,
  },
  diaNome: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
  },
  totalContainer: {
    marginTop: 25,
    padding: 20,
    backgroundColor: '#b2dfdb',
    borderRadius: 10,
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});