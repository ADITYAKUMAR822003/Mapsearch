import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import CustomSelectList from '../components/CustomSelectList';
import CustomButton from '../components/CustomButton';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import Config from 'react-native-config';
import axios from 'axios';

const DeleteServices = () => {
    const navigation = useNavigation();
    const baseUrl = Config.API_BASE_URL;
    const route = useRoute();
    const { username } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [select, setSelect] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [category, setCategory] = useState('');
    const [subcategory, setSubCategory] = useState('');
    const servicesToRemove = { [category]: subcategory };
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
            const userServices = async () => {
                try {
                    setLoading(true);
                    const apiUrl = `${baseUrl}/api/user-services/${username}`;
                    const response = await axios.get(apiUrl);
                    if (response.status === 200) {
                        const servicesData = response.data[0].services;
                        const formattedCategories = Object.keys(servicesData).map((category) => ({
                            key: category,
                            value: category,
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
            userServices();
        }, [baseUrl, username])
    );

    const handleCategorySelect = async (selectedCategory) => {
        setCategory(selectedCategory);
        try {
            setLoading(true);
            const apiUrl = `${baseUrl}/api/user-services/${username}`;
            const response = await axios.get(apiUrl);
            if (response.status === 200) {
                const servicesData = response.data[0].services;
                const formattedCategories = Object.keys(servicesData).map((category) => ({
                    key: category,
                    value: category,
                    subcategories: servicesData[category],
                }));
                setCategories(formattedCategories);
                console.log('Server Response:', formattedCategories);
                const fetchedCategoryData = formattedCategories.find((item) => item.key === selectedCategory);
                setSubcategories(fetchedCategoryData.subcategories);
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
        Alert.alert('Confirm Deletion', 'Are you sure you want to delete the selected services?',
            [
                { text: 'No', onPress: clearFields, style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const apiUrl = `${baseUrl}/api/user-services/${username}`;
                            const data = { servicesToRemove };
                            const response = await axios.delete(apiUrl, { data });
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
                    },
                },
            ]
        );
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
        <SafeAreaView style={GlobalStyle.container}>
            <View style={{ padding: 20 }}>
                {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
                <View style={GlobalStyle.headingContainer}>
                    <Text style={GlobalStyle.headingText}>{Strings.deleteYour}</Text>
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
        </SafeAreaView>
    );
};

export default DeleteServices;