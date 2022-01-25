import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from '../pages/MainPage';
import WritePage from '../pages/WritePage';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

const StackNavigator = () => {
    
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomColor: "#aaa",
                    shadowColor: "#aaa",
                    height: 100,
                },
                
                headerTitleAlign: 'center',
                headerTintColor: "#000",
                headerBackTitleVisible: false,
                
            }}

        >
            <Stack.Screen name="MainPage" component={MainPage}/>
            <Stack.Screen name="WritePage" component={WritePage}/>
        </Stack.Navigator>
        
    )
}
export default StackNavigator;