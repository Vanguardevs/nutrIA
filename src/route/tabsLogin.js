import {Tabs} from 'expo-router';
import LoginPag from '../pages/loginUser/login';

export default function tabsRouter(){
    return(
        <Tabs>
            <Tabs.Screen name="Sign IN" options={{title: "loginUser"}} component={LoginPag}/>
        </Tabs>
    )
}
