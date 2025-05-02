import React, { useState } from 'react';
import CustomButton from '../../../components/CustomButton';
import CustomField from '../../../components/CustomField';
import { View, SafeAreaView, Text } from 'react-native';


export default function SecurityAccount() {
    return(
        <SafeAreaView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <CustomField title='Email atual' placeholder="Seu email"/>
            </View>
        </SafeAreaView>
    );
}