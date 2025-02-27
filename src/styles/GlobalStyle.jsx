import { StyleSheet } from 'react-native';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

export const GlobalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginVertical: 10,
  },
  headingContainer: {
    alignItems: 'center',
  },
  headingText: {
    fontSize: 32,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.Regular,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: colors.primary,
    fontFamily: fonts.Medium,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
    padding: 10,
  },
  continueText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.gray,
    padding: 10,
    margin: 10,
    borderRadius: 12,
    elevation: 3,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
  selectedText: {
    color: colors.secondary,
    fontFamily: fonts.Bold,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  boxStyle: {
    marginTop: 30,
    borderColor: colors.secondary,
  },
  inputStyle: {
    color: colors.secondary,
  },
  dropdownStyle: {
    borderColor: colors.secondary,
  },
  dropdownTextStyle: {
    color: colors.secondary,
  },
  labelStyle: {
    color: colors.primary,
  },
  checkBoxStyle: {
    borderColor: colors.secondary,
  },
  labelStyles: {
    color: colors.primary,
  },
  badgeStyles: {
    backgroundColor: colors.secondary,
  },
  badgeTextStyles: {
    color: colors.white,
  },
});
