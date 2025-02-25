import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, Alert, SafeAreaView } from 'react-native';
import Strings from '../localization/strings';
import { GlobalStyle } from '../styles/GlobalStyle';
import CustomButton from '../components/CustomButton';
import { colors } from '../utility/colors';
import CustomTextInput from '../components/CustomTextInput';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = () => {
  const navigation = useNavigation();
  const baseUrl = Config.API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [secureEntery, setSecureEntery] = useState(true);
  const [showUser, setShowUser] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleForgot = () => navigation.navigate('ForgotPassword');
  const handleSignup = () => navigation.navigate('SignupScreen');

  const validateUser = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username contain only alphabets.';
    } else if (username.length < 5 || username.length > 20) {
      newErrors.username = 'Username must be between 5 and 20 characters.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{12,}$/.test(password)) {
      newErrors.password = 'Password must have at least one Uppercase, Lowercase, Digit, Special characters & 12 characters.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePhone = () => {
    const newErrors = {};
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Phone Number is required.';
    } else if (!/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Phone Number.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email id is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email id.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      if (showUser && validateUser()) {
        const apiUrl = `${baseUrl}/auth/login`;
        //console.log(apiUrl);
        `${baseUrl}/auth/login`;
        const data = { username, password };
        const response = await axios.post(apiUrl, data);
        if (response.status === 200) {
          navigation.navigate('DrawerNavigator', { username });
          console.log('Server Response:', response.data);
        }
      } else if (showPhone && validatePhone()) {
        const apiUrl =
          `${baseUrl}/auth/login-with-mobile`;
        const data = { mobileNumber };
        const response = await axios.post(apiUrl, data);
        if (response.status === 200) {
          navigation.navigate('MobileVerification', { mobileNumber });
          console.log('Server Response:', response.data);
        }
      } else if (showEmail && validateEmail()) {
        const apiUrl =
          `${baseUrl}/auth/login-with-email`;
        const data = { email };
        const response = await axios.post(apiUrl, data);
        if (response.status === 200) {
          navigation.navigate('EmailVerification', { email });
          console.log('Server Response:', response.data);
        }
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data, [{ text: 'OK', onPress: clearFields }]);
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

  const clearFields = () => {
    setUsername('');
    setPassword('');
    setPhoneNumber('');
    setEmail('');
  };

  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setEmail('');
      setPhoneNumber('');
      setError('');
    }, [])
  );

  const handleUserClick = () => {
    setShowUser(true);
    setShowPhone(false);
    setShowEmail(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handlePhoneClick = () => {
    setShowUser(false);
    setShowPhone(true);
    setShowEmail(false);
    setPhoneNumber('');
    setError('');
  };

  const handleEmailClick = () => {
    setShowUser(false);
    setShowPhone(false);
    setShowEmail(true);
    setEmail('');
    setError('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#003AAA', '#009AA5']} style={styles.headerBackground}>
        <Text style={styles.headerText}>{Strings.loginTitle}</Text>
      </LinearGradient>

      <View style={styles.card}>
        {loading && <ActivityIndicator size={50} color={colors.success} style={styles.loader} />}

        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={handleUserClick} style={[styles.tab, showUser && styles.activeTab]}>
            <Text style={[styles.tabText, showUser && styles.activeTabText]}>{Strings.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePhoneClick} style={[styles.tab, showPhone && styles.activeTab]}>
            <Text style={[styles.tabText, showPhone && styles.activeTabText]}>{Strings.mobile}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmailClick} style={[styles.tab, showEmail && styles.activeTab]}>
            <Text style={[styles.tabText, showEmail && styles.activeTabText]}>{Strings.email}</Text>
          </TouchableOpacity>
        </View>

        <View>
          {showUser && (
            <View>
              <CustomTextInput
                value={username}
                onChangeText={setUsername}
                placeholder={Strings.usernamePlaceholder + ' *'}
                iconName="user"
                errorMessage={error.username}
              />
              <CustomTextInput
                value={password}
                onChangeText={setPassword}
                placeholder={Strings.passwordPlaceholder + ' *'}
                iconName="lock"
                secureTextEntry={secureEntery}
                onPress={() => setSecureEntery(!secureEntery)}
                eyename={'eye'}
                errorMessage={error.password}
              />
              <TouchableOpacity>
                <Text onPress={handleForgot} style={styles.forgotPasswordText}>{Strings.forgot}</Text>
              </TouchableOpacity>
            </View>
          )}
          {showPhone && (
            <View>
              <CustomTextInput
                value={mobileNumber}
                onChangeText={setPhoneNumber}
                placeholder={Strings.mobilePlaceholder + ' *'}
                keyboardType="phone-pad"
                iconName="phone"
                maxLength={10}
                errorMessage={error.mobileNumber}
              />
            </View>
          )}
          {showEmail && (
            <View>
              <CustomTextInput
                value={email}
                onChangeText={setEmail}
                placeholder={Strings.emailPlaceholder + ' *'}
                keyboardType="email-address"
                iconEmail="mail-outline"
                errorMessage={error.email}
              />
            </View>
          )}
        </View>

        <CustomButton title={Strings.loginButton} onPress={handleLogin} style={styles.loginButton} />

        <Text style={styles.orText}>{Strings.orContinue}</Text>

        <View style={styles.footerContainer}>
          <Text style={styles.accountText}>{Strings.dontHave}</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>{Strings.signupButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3eaff',
  },
  headerBackground: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    backgroundColor: '#e3eaff',
    marginHorizontal: 20,
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    backgroundColor: '#e3eaff',
    borderRadius: 8,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#007AFF',
    textAlign: 'right',
    marginTop: 5,
  },
  loginButton: {
    marginTop: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#888',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  accountText: {
    fontSize: 14,
    color: '#666',
    
  },
  signupText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
