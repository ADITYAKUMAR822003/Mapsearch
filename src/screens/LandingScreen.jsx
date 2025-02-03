import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

const LandingScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleSignup = () => {
    navigation.navigate('SignupScreen');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Image
        source={require('../assets/images/man.png')}
        style={styles.bannerImage}
      />
      <Text style={styles.title}>Welcome to Service Search!</Text>
      <Text style={styles.subTitle}>Our services are now just a click away!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{Strings.loginButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.loginButtonWrapper]} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>{Strings.signupButton}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: 140,
    marginVertical: 30,
  },
  bannerImage: {
    marginVertical: 20,
    height: 250,
    width: 231,
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.SemiBold,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.primary,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.secondary,
    fontFamily: fonts.Medium,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    width: '80%',
    height: 60,
    borderRadius: 100,
  },
  loginButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderRadius: 98,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    color: colors.secondary,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});
