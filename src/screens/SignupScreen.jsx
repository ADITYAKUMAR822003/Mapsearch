import React, { useState, useCallback } from 'react';
import { Text, ActivityIndicator, TouchableOpacity, View, Alert, SafeAreaView } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyle';
import { colors } from '../utility/colors';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Strings from '../localization/strings';
import Config from 'react-native-config';
import axios from 'axios';

const SignupScreen = () => {
  const navigation = useNavigation();
  const baseUrl = Config.API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [secureEntery, setSecureEntery] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => navigation.navigate('LoginScreen');

  const validateInput = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username contain only Alphabets, Numbers & Underscores.';
    } else if (username.length < 5 || username.length > 15) {
      newErrors.username = 'Username must be between 5 and 15 characters.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email id is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid Email id.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(password)) {
      newErrors.password = 'Password must have at least one Uppercase, Lowercase, Digit, Special characters & 12 characters.';
    }
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Mobile Number.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/auth/signup`;
      const data = { username, email, password, mobileNumber };
      const response = await axios.post(apiUrl, data);
      if (response.status === 200) {
        if (response.data === 'This username is already taken. Please try another one.') {
          Alert.alert('Error', response.data, [{ text: 'OK', onPress: clearFields }]);
          console.log('Server Response:', response.data);
        } else if (response.data === 'This mobile number is already in use. Please try another one.') {
          Alert.alert('Error', response.data, [{ text: 'OK', onPress: clearFields }]);
          console.log('Server Response:', response.data);
        } else {
          navigation.navigate('SignupVerification', { username, email, password, mobileNumber });
          console.log('Server Response:', response.data);
        }
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', 'Please use a different username and mobile number that are not already in use.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Server responded with an error:', error.response.data);
      } else if (error.request) {
        Alert.alert('Error', 'Server has failed, Please try again later.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Server has Failed:', error.request._response);
      } else {
        Alert.alert('Error', 'Server is busy, Please try again later.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Error setting up request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => (setUsername(''), setPassword(''), setPhoneNumber(''), setEmail(''));

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setError('');
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={GlobalStyle.container}>
        {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
        <View style={GlobalStyle.textContainer}>
          <Text style={GlobalStyle.headingText}>{Strings.signupTitle}</Text>
        </View>
        <View>
          <CustomTextInput
            value={username}
            onChangeText={setUsername}
            placeholder={Strings.usernamePlaceholder}
            iconName="user"
            errorMessage={error.username}
          />
          <CustomTextInput
            value={email}
            onChangeText={setEmail}
            placeholder={Strings.emailPlaceholder}
            keyboardType="email-address"
            iconEmail="mail-outline"
            errorMessage={error.email}
          />
          <CustomTextInput
            value={password}
            onChangeText={setPassword}
            placeholder={Strings.passwordPlaceholder}
            iconName="lock"
            secureTextEntry={secureEntery}
            onPress={() => setSecureEntery(!secureEntery)}
            eyename={'eye'}
            errorMessage={error.password}
          />
          <CustomTextInput
            value={mobileNumber}
            onChangeText={setPhoneNumber}
            placeholder={Strings.mobilePlaceholder}
            keyboardType="phone-pad"
            iconName="screen-smartphone"
            maxLength={10}
            errorMessage={error.mobileNumber}
          />
        </View>
        <CustomButton title={Strings.signupButton} onPress={handleSignUp} />
        <Text style={GlobalStyle.continueText}>{Strings.orContinue}</Text>
        <View style={GlobalStyle.footerContainer}>
          <Text style={GlobalStyle.accountText}>{Strings.alreadyHave}</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={GlobalStyle.signupText}>{Strings.loginButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
