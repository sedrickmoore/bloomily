import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserTab from "./UserTab";

const Stack = createStackNavigator();

export default function App() {


    return(

        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="UserTab" component={UserTab}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}