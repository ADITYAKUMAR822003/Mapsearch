import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import { GlobalStyle } from '../styles/GlobalStyle';
import { colors } from '../utility/colors';

const BackButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={GlobalStyle.backButtonWrapper} onPress={onPress}>
            <Ionicons
                name={'arrow-back-outline'}
                color={colors.white}
                size={25}
            />
        </TouchableOpacity>
    );
};

export default BackButton;