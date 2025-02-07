import React, { useState } from 'react';
import { Text, ActivityIndicator, View, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyle';
import BackButton from '../components/BackButton';
import CustomButton from '../components/CustomButton';
import { colors } from '../utility/colors';
import CustomTextInput from '../components/CustomTextInput';
import { useNavigation, useRoute } from '@react-navigation/native';
import Strings from '../localization/strings';
import Config from 'react-native-config';
import axios from 'axios';

const ResetPassword = () => {
  const navigation = useNavigation();
  const baseUrl = Config.API_BASE_URL;
  const route = useRoute();
  const { username } = route.params;
  const [loading, setLoading] = useState(false);
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureEntery, setSecureEntery] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [error, setError] = useState('');

  const handleGoBack = () => navigation.navigate('ForgotPassword');

  const validateInput = () => {
    const newErrors = {};
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Password is required.';
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(newPassword)) {
      newErrors.newPassword = 'Password must have at least one Uppercase, Lowercase, Digit, Special characters & 12 characters.';
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Conform Password is required.';
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(confirmPassword)) {
      newErrors.confirmPassword = 'Password must have at least one Uppercase, Lowercase, Digit, Special characters & 12 characters.';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    if (!validateInput()) return;
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/auth/reset-password`;
      const data = { username, newPassword, confirmPassword };
      const response = await axios.post(apiUrl, data);
      if (response.status === 200) {
        navigation.navigate('LoginScreen');
        console.log('Server Response:', response.data);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', 'Please use a different username that are not already in use.', [{ text: 'OK', onPress: clearFields }]);
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

  const clearFields = () => (setPassword(''), setConfirmPassword(''));

  return (
    <View style={GlobalStyle.container}>
      {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
      <BackButton onPress={handleGoBack} />
      <View style={GlobalStyle.textContainer}>
        <Text style={GlobalStyle.headingText}>{Strings.passwordPlaceholder}</Text>
      </View>
      <View>
        <CustomTextInput value={username} iconName="user" editable={false} />
        <CustomTextInput
          value={newPassword}
          onChangeText={setPassword}
          placeholder={Strings.newPassword}
          iconName="lock"
          secureTextEntry={secureEntery}
          onPress={() => setSecureEntery(!secureEntery)}
          eyename={'eye'}
        />
        {error.newPassword && (
          <Text style={GlobalStyle.errorText}>{error.newPassword}</Text>
        )}
        <CustomTextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={Strings.conformPassword}
          iconName="lock"
          secureTextEntry={secureConfirm}
          onPress={() => setSecureConfirm(!secureConfirm)}
          eyename={'eye'}
        />
        {error.confirmPassword && (
          <Text style={GlobalStyle.errorText}>{error.confirmPassword}</Text>
        )}
      </View>
      <CustomButton title={Strings.resetButton} onPress={handleReset} />
    </View>
  );
};

export default ResetPassword;