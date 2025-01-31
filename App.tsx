import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupVerification from './src/screens/OTP/SignupVerification';
import MobileVerification from './src/screens/OTP/MobileVerification';
import EmailVerification from './src/screens/OTP/EmailVerification';
import ForgotPassword from './src/screens/ForgotPassword';
import ResetVerification from './src/screens/OTP/ResetVerification';
import ResetPassword from './src/screens/ResetPassword';
import DrawerNavigator from './src/navigation/DrawerNavigator';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingScreen" component={LandingScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupVerification" component={SignupVerification} />
        <Stack.Screen name="MobileVerification" component={MobileVerification} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetVerification" component={ResetVerification} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
