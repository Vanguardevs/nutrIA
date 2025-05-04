import React, { useState } from 'react';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme } from 'react-native';


export default function AccountUser() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    return(
        <SafeAreaView style={{backgroundColor: background, flex:1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CustomField title='Email atual' placeholder="Seu email"/> 
            </View>
        </SafeAreaView>
    );
}