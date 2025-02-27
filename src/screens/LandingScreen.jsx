import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

const LandingScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => navigation.navigate('LoginScreen');
  const handleSignup = () => navigation.navigate('SignupScreen');

  return (
    <SafeAreaView style={GlobalStyle.container}>
      <Image source={require('../assets/images/logo.jpg')} style={styles.bannerImage} />
      <Text style={styles.title}>Welcome to Service Search!</Text>
      <Text style={styles.subTitle}>Snipy are now just a click away!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.loginButtonWrapper, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{Strings.loginButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.loginButtonWrapper]} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>{Strings.signupButton}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  bannerImage: {
    marginVertical: 20,
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.Bold,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.dark,
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.secondary,
    fontFamily: fonts.SemiBold,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    width: "80%",
    height: 60,
    borderRadius: 100,
    alignSelf: 'center',
  },
  loginButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
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
