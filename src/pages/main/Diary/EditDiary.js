import {View, SafeAreaView, ImageBackground, StyleSheet} from 'react-native'

export default function EditDiary(){
    return(
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../../../assets/Frutas_home.png')} style={styles.imgBackgound}>

            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center'
    },
    imgBackgound:{
        width: '100%', 
        height: '100%'
    }
})