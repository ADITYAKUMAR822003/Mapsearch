import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyle';

const CustomButton = ({ title, onPress, disabled }) => {
    return (
        <TouchableOpacity style={GlobalStyle.loginButtonWrapper} disabled={disabled} onPress={onPress}>
            <Text style={GlobalStyle.loginText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;
