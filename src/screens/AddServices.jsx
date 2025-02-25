import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import CustomSelectList from '../components/CustomSelectList';
import CustomButton from '../components/CustomButton';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';
import Config from 'react-native-config';
import axios from 'axios';

const AddServices = () => {
    const navigation = useNavigation();
    const baseUrl = Config.API_BASE_URL;
    const route = useRoute();
    const username = route?.params?.username;
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [select, setSelect] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subcategory, setSubCategory] = useState([]);
    const services = { [category]: subcategory };
    const [error, setError] = useState('');

    const validateInput = () => {
        const newErrors = {};
        if (!category.trim()) {
            newErrors.category = 'Category is required.';
        }
        if (!subcategory.length) {
            newErrors.subcategory = 'Sub-Category is required.';
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useFocusEffect(
        useCallback(() => {
            const userCategory = async () => {
                try {
                    setLoading(true);
                    const apiUrl = `${baseUrl}/api/categories`;
                    const response = await axios.get(apiUrl);
                    if (response.status === 200) {
                        const formattedCategories = response.data.map((category) => ({
                            key: category.name,
                            value: category.name,
                        }));
                        setCategories(formattedCategories);
                        console.log('Server Response:', formattedCategories);
                    }
                } catch (error) {
                    if (error.response) {
                        console.log('Server responded with an error:', error.response.data);
                    } else if (error.request) {
                        console.log('Server has Failed:', error.request._response);
                    } else {
                        console.log('Error setting up request:', error.message);
                    }
                } finally {
                    setLoading(false);
                }
            };
            userCategory();
        }, [baseUrl])
    );

    const handleCategorySelect = async (selectedCategory) => {
        setCategory(selectedCategory);
        try {
            setLoading(true);
            const apiUrl = `${baseUrl}/api/categories/subcategories/${selectedCategory}`;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                const formattedSubcategories = response.data.map((subcategory) => ({
                    key: subcategory.name,
                    value: subcategory.name,
                }));
                setSubcategories(formattedSubcategories);
                console.log('Server Response:', formattedSubcategories);
            }
        } catch (error) {
            if (error.response) {
                console.log('Server responded with an error:', error.response.data);
            } else if (error.request) {
                console.log('Server has Failed:', error.request._response);
            } else {
                console.log('Error setting up request:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleHome = async () => {
        if (!validateInput()) return;
        try {
            setLoading(true);
            const apiUrl = `${baseUrl}/api/user-services/add`;
            const data = { username, services };
            const response = await axios.post(apiUrl, data);
            if (response.status === 200) {
                Alert.alert('Success', response.data, [{ text: 'OK', onPress: () => navigation.navigate('HomeScreen') }]);
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
        setReset(true);
        setCategory('');
        setSubCategory([]);
        setError('');
        setReset(false);
    };

    useEffect(() => {
        if (select) {
            setSubCategory([]);
            setSelect(false);
        }
    }, [select]);

    useFocusEffect(
        useCallback(() => {
            setReset(false);
            return () => {
                setCategory('');
                setSubCategory([]);
                setSubcategories([]);
                setError('');
                setReset(true)
            };
        }, [])
    );

    return (
        
        <View style={GlobalStyle.container}>
            {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
            <View>
                <Text style={styles.headingText}>{Strings.addYour}</Text>
            </View>
            {!reset && (
                <>
                    <CustomSelectList
                        onSelect={() => setSelect(true)}
                        setSelected={handleCategorySelect}
                        data={categories}
                        placeholder={Strings.categoryPlaceholder}
                        searchPlaceholder={Strings.searchCatPlaceholder}
                        error={error.category}
                    />
                    {!select && (
                        <CustomSelectList
                            setSelected={setSubCategory}
                            data={subcategories || []}
                            placeholder={Strings.subCategoryPlaceholder}
                            searchPlaceholder={Strings.searchSubPlaceholder}
                            error={error.subcategory}
                            save="value"
                            multiple={true}
                        />
                    )}
                </>
            )}
            <CustomButton title={Strings.otpButton} onPress={handleHome} />
        </View>
    );
};

export default AddServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.success,
        padding: 20,
    },
    headingText: {
        fontSize: 32,
        color: colors.primary,
        fontFamily: fonts.SemiBold,
    },
});