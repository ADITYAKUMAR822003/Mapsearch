import { StyleSheet } from 'react-native';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

export const GlobalOTPStyle = StyleSheet.create({
    headingContent: {
        fontSize: 20,
        color: colors.primary,
    },
    errorOTP: {
        color: colors.danger,
        fontFamily: fonts.Regular,
        textAlign: 'center',
    },
    otpContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
    },
    otpBox: {
        borderRadius: 5,
        borderColor: colors.secondary,
        borderWidth: 0.5,
    },
    otpText: {
        color: colors.primary,
        fontFamily: fonts.Light,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    footerContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
