import React, { useState } from 'react';
import { Text, ActivityIndicator, View, Alert } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyle';
import BackButton from '../components/BackButton';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import { colors } from '../utility/colors';
import { useNavigation } from '@react-navigation/native';
import Strings from '../localization/strings';
import Config from 'react-native-config';
import axios from 'axios';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const baseUrl = Config.API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const validateInput = () => {
        const newErrors = {};
        if (!username.trim()) {
            newErrors.username = 'Username is required.';
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            newErrors.username = 'Username contain only Alphabets, Numbers & Underscores.';
        } else if (username.length < 5 || username.length > 20) {
            newErrors.username = 'Username must be between 5 and 20 characters.';
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = async () => {
        if (!validateInput()) return;
        try {
            setLoading(true);
            const apiUrl = `${baseUrl}/auth/request-password-reset`;
            const data = { username };
            const response = await axios.post(apiUrl, data);
            if (response.status === 200) {
                navigation.navigate('ResetVerification', { username });
                console.log('Server Response:', response.data);
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
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={GlobalStyle.container}>
            {loading && (
                <ActivityIndicator size="50" color={colors.success} style={GlobalStyle.loader} />
            )}
            <BackButton onPress={handleGoBack} />
            <View style={GlobalStyle.textContainer}>
                <Text style={GlobalStyle.headingText}>{Strings.resetTitle}</Text>
            </View>
            <View>
                <CustomTextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder={Strings.usernamePlaceholder}
                    iconName="user"
                />
                {error.username && (
                    <Text style={GlobalStyle.errorText}>{error.username}</Text>
                )}
            </View>
            <CustomButton title={Strings.resetButton} onPress={handleReset} />
        </View>
    );
};

export default ForgotPassword;