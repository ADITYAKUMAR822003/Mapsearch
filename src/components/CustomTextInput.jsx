import React from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GlobalStyle } from '../styles/GlobalStyle';
import { colors } from '../utility/colors';

const CustomTextInput = ({ iconName, iconEmail, value, onChangeText, placeholder, keyboardType, maxLength, secureTextEntry, onPress, eyename, editable, errorMessage }) => {
    return (
        <>
            <View style={GlobalStyle.inputContainer}>
                <SimpleLineIcons name={iconName} size={30} color={colors.secondary} />
                <Ionicons name={iconEmail} size={30} color={colors.secondary} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    style={GlobalStyle.textInput}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondary}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                />
                <TouchableOpacity onPress={onPress}>
                    <SimpleLineIcons name={eyename} size={20} color={colors.secondary} />
                </TouchableOpacity>
            </View>
            {errorMessage && (<Text style={GlobalStyle.errorText}>{errorMessage}</Text>)}
        </>
    );

};

export default CustomTextInput;