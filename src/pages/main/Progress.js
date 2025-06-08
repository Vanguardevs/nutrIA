import React from 'react';
import { View, ImageBackground, SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';

export default function Progress(){
     const colorScheme = useColorScheme(); 

    const backgoundH = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const backgoundIcons = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    const data = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ];

    const barColor = colorScheme === 'dark' ? 'rgba(134, 65, 244, 0.8)' : '#6a1b9a';

    return(
         <SafeAreaView style={[styles.container, { backgroundColor: backgoundH }]}>
             <ImageBackground 
                source={require('../../../assets/Frutas_home.png')} 
                style={styles.homeBackground}
                resizeMode="cover"
            >
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
         justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
         width: '100%',
    },
})