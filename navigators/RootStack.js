
import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from './../components/style';
const {primary, tertiary} = Colors

//Screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';

const Stack = createStackNavigator();

import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
        {({storedCredentials}) => (
            <NavigationContainer >
            <Stack.Navigator
                screenOptions={{
                    headStyle: {
                        background: 'transparent'
                    },
                    headerTintColor: tertiary,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeftContainerStyle: {
                        paddingLeft: 20
                    }
                }}
                initialRouteName="Login"
            >
               {storedCredentials ? (
                            <Stack.Screen /*options={{ headerTintColor: primary }} */ name="Welcome" component={Welcome} />
                 ) : (
                        <> 
                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Signup" component={Signup} />
                        </>
                )} 
            
            

            </Stack.Navigator>
        </NavigationContainer>
        )}
    </CredentialsContext.Consumer>
        
  )
}

export default RootStack