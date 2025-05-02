import React, { useState } from 'react';
import { View, SafeAreaView, Text } from 'react-native';


export default function AccountUser() {
    return(
        <SafeAreaView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Account</Text>
            </View>
        </SafeAreaView>
    );
}