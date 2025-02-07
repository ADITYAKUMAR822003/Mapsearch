import React, { useState, useRef, useEffect } from 'react';
import { Text, TextInput, ActivityIndicator, TouchableOpacity, View, Alert, SafeAreaView } from 'react-native';
import { GlobalStyle } from '../../styles/GlobalStyle';
import { GlobalOTPStyle } from '../../styles/GlobalOTPStyle';
import BackButton from '../../components/BackButton';
import CustomButton from '../../components/CustomButton';
import { colors } from '../../utility/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import Strings from '../../localization/strings';
import Config from 'react-native-config';
import axios from 'axios';

const EmailVerification = () => {
  const navigation = useNavigation();
  const baseUrl = Config.API_BASE_URL;
  const route = useRoute();
  const { email } = route.params;
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendActive, setIsResendActive] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const firstInput = useRef(null);
  const secondInput = useRef(null);
  const thirdInput = useRef(null);
  const fourthInput = useRef(null);
  const [isotp, setOtp] = useState({ 1: '', 2: '', 3: '', 4: '' });
  const [error, setError] = useState('');
  const getOtpString = () => {
    return Object.values(isotp).join('');
  };
  const otp = getOtpString();
  const handleGoBack = () => navigation.goBack();

  const validateInput = () => {
    const newErrors = {};
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required.';
    } else if (!/^[0-9]{4}$/.test(otp)) {
      newErrors.otp = 'Please enter a valid 4-digit OTP.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    firstInput.current.focus();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendActive(false);
      setIsButtonDisabled(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = async () => {
    setTimer(60);
    setIsResendActive(true);
    setIsButtonDisabled(false);
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/auth/login-with-email`;
      const data = { email };
      const response = await axios.post(apiUrl, data);
      if (response.status === 200) {
        console.log('Server Response:', response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateInput()) return;
    try {
      setLoading(true);
      const apiUrl = `${baseUrl}/auth/verify-email-otp`;
      const data = { email, otp };
      const response = await axios.post(apiUrl, data);
      if (response.status === 200) {
        navigation.navigate('DrawerNavigator'),
          console.log('Server Response:', response.data);
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', 'Invalid OTP, Please try again.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Server responded with an error:', error.response.data);
      } else if (error.request) {
        Alert.alert('Error', 'Server has Failed, Please try again later.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Server has Failed:', error.request._response);
      } else {
        Alert.alert('Error', 'Server is busy, Please try again later.', [{ text: 'OK', onPress: clearFields }]);
        console.log('Error setting up request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearFields = () => {
    setOtp({ 1: '', 2: '', 3: '', 4: '' });
    firstInput.current.clear();
    secondInput.current.clear();
    thirdInput.current.clear();
    fourthInput.current.clear();
    firstInput.current.focus();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={GlobalStyle.container}>
        {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
        <BackButton onPress={handleGoBack} />
        <View style={GlobalStyle.textContainer}>
          <Text style={GlobalStyle.headingText}>{Strings.otpTitle}</Text>
          <Text style={GlobalOTPStyle.headingContent}>{Strings.otpSubTitleEmail}</Text>
        </View>
        <View>
          {error.otp && <Text style={GlobalOTPStyle.errorOTP}>{error.otp}</Text>}
          <View style={GlobalOTPStyle.otpContainer}>
            <View style={GlobalOTPStyle.otpBox}>
              <TextInput
                style={GlobalOTPStyle.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={firstInput}
                onChangeText={text => {
                  setOtp({ ...isotp, 1: text });
                  text && secondInput.current.focus();
                }}
              />
            </View>
            <View style={GlobalOTPStyle.otpBox}>
              <TextInput
                style={GlobalOTPStyle.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={secondInput}
                onChangeText={text => {
                  setOtp({ ...isotp, 2: text });
                  text ? thirdInput.current.focus() : firstInput.current.focus();
                }}
              />
            </View>
            <View style={GlobalOTPStyle.otpBox}>
              <TextInput
                style={GlobalOTPStyle.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={thirdInput}
                onChangeText={text => {
                  setOtp({ ...isotp, 3: text });
                  text
                    ? fourthInput.current.focus()
                    : secondInput.current.focus();
                }}
              />
            </View>
            <View style={GlobalOTPStyle.otpBox}>
              <TextInput
                style={GlobalOTPStyle.otpText}
                keyboardType="number-pad"
                maxLength={1}
                ref={fourthInput}
                onChangeText={text => {
                  setOtp({ ...isotp, 4: text });
                  !text && thirdInput.current.focus();
                }}
              />
            </View>
          </View>
          <View style={GlobalOTPStyle.footerContainer}>
            <Text style={GlobalStyle.accountText}>
              {timer > 0
                ? `Resend OTP in ${timer} seconds`
                : 'You can resend the OTP now'}
            </Text>
            <TouchableOpacity onPress={handleResendOTP} disabled={isResendActive}>
              <Text style={GlobalStyle.forgotPasswordText}>
                {isResendActive ? 'Wait for resend' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>
          <CustomButton title={Strings.otpButton} onPress={handleVerifyOTP} disabled={isButtonDisabled} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerification;
