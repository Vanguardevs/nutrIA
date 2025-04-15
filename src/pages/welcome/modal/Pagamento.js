import { Modal, View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import CustomButton from "../../components/CustomButton";

export function CustomModal({modalVisible, setModalVisible}) {
    return(
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModal(setModalVisible)}
        >
            <SafeAreaView style={styles.containter}>
                
                <Text>Pague para ter acesso a:</Text>
                <Text>1. Atendimento totalmente personalizado</Text>

                    <CustomButton title="Fechar" onPress={() => setModalVisible(false)}/>
                    <CustomButton title="9,90" onPress={() => setModalVisible(false)}/>

            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({ 
    containter:{
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        borderRadius: 10, 
        margin: 20
    },

})