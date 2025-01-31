import React from 'react';
import { Text } from 'react-native';
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';

const CustomSelectList = ({ multiple = false, onSelect, setSelected, data, error, placeholder, save, searchPlaceholder }) => {
    const SelectComponent = multiple ? MultipleSelectList : SelectList;
    return (
        <>
            <SelectComponent
                onSelect={onSelect}
                setSelected={setSelected}
                data={data}
                placeholder={placeholder}
                boxStyles={GlobalStyle.boxStyle}
                inputStyles={GlobalStyle.inputStyle}
                dropdownStyles={GlobalStyle.dropdownStyle}
                dropdownTextStyles={GlobalStyle.dropdownTextStyle}
                save={save}
                searchPlaceholder={searchPlaceholder}
                label={Strings.labelSubPlaceholder}
                notFoundText={Strings.notFoundText}
                checkBoxStyles={GlobalStyle.checkBoxStyle}
                labelStyles={GlobalStyle.labelStyle}
                badgeStyles={GlobalStyle.badgeStyles}
                badgeTextStyles={GlobalStyle.badgeTextStyles}
            />
            {error && <Text style={GlobalStyle.errorText}>{error}</Text>}
        </>
    );
};

export default CustomSelectList;
