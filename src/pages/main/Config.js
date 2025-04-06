import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";

export default function Settings(){

    const navigation = useNavigation();

    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Configurações</Text>
            <CustomButton title="Sair" onPress={() => {navigation.navigate("Login")}}/>
        </View>
    )
}