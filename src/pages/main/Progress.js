import React from 'react';
import { View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts'; // 1. Importe os componentes do gráfico

export default function Progress(){
    // Corrigi o nome da variável de 'colorSheme' para 'colorScheme'
     const colorScheme = useColorScheme(); 

    const backgoundH = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    // A cor dos ícones não foi usada neste exemplo
    const backgoundIcons = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    // 2. Crie dados de exemplo para o gráfico
    const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];

    // Define a cor das barras com base no tema (dark/light)
    const barColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    return(
         <SafeAreaView style={[styles.container, { backgroundColor: backgoundH }]}>
            {/* Adicionei resizeMode="cover" para garantir que a imagem cubra o fundo */}
             <ImageBackground 
                source={require('../../../assets/Frutas_home.png')} 
                style={styles.homeBackground}
                resizeMode="cover"
            >
                {/* 3. Adicione um contêiner para o gráfico ter um tamanho definido */}
                <View style={{ height: '45%', width: '90%' }}>
                    <BarChart
                        style={{ flex: 1 }}
                        data={data}
                        svg={{ fill: barColor }}
                        contentInset={{ top: 30, bottom: 30 }}
                    >
                        <Grid />
                    </BarChart>
                </View>
             </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
     flex:1
    },
    homeBackground: {
     flex: 1,
        // Alinhei os itens ao centro para o gráfico ficar centralizado
         justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
         width: '100%',
    },
})