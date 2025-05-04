import React, { useState } from 'react';
import CustomButton from '../../../components/CustomButton';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text, useColorScheme } from 'react-native';


export default function SecurityAccount() {

    const colorScheme = useColorScheme();

    const background = colorScheme === 'dark'? "#1C1C1E" : "#F2F2F2";
    const texts = colorScheme === 'dark'? "#F2F2F2" : "#1C1C1E";

    return(
        <SafeAreaView style={{backgroundColor: background, flex: 1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            </View>
        </SafeAreaView>
    );
}