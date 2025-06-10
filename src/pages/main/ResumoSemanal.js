import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumo Semanal</Text>

      {dadosSemana.map((diaData, index) => (
        <View key={index} style={styles.diaContainer}>
          <Text style={styles.diaNome}>{diaData.dia}</Text>
          <Text>Calorias: {diaData.calorias} kcal</Text>
          <Text>Valor Energético: {diaData.valorEnergetico} kJ</Text>
          <Text>Alimentos Comidos: {diaData.comidos}</Text>
          <Text>Alimentos Não Comidos: {diaData.naoComidos}</Text>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Totais Semanais</Text>
        <Text>Calorias Totais: {totalCalorias} kcal</Text>
        <Text>Valor Energético Total: {totalValorEnergetico} kJ</Text>
        <Text>Total Alimentos Comidos: {totalComidos}</Text>
        <Text>Total Alimentos Não Comidos: {totalNaoComidos}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
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
    fontSize: 18,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});