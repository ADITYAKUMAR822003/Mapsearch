import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomSelectList from '../components/CustomSelectList';
import Geolocation from 'react-native-geolocation-service';
import CustomButton from '../components/CustomButton';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';
import Config from 'react-native-config';
import 'react-native-get-random-values';
import axios from 'axios';

const SearchServices = () => {
    const navigation = useNavigation();
    const baseUrl = Config.API_BASE_URL;
    const googlePlaceApiKey = Config.GOOGLE_PLACES_API_KEY;
    const route = useRoute();
    const { username } = route.params || {};
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [select, setSelect] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [category, setCategory] = useState('');
    const [includedTypes, setSubCategory] = useState('');
    const [maxResultCount, setMaximumRating] = useState(4);
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [radius, setRadius] = useState(500.0);
    const [error, setError] = useState('');
    const placesRef = useRef(null);
    const [editable, setEditable] = useState(false);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            // const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            // console.log('iOS Location Permission Status:', result);
            // return result === RESULTS.GRANTED;
            const whenInUse = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log('iOS LOCATION_WHEN_IN_USE:', whenInUse);
            if (whenInUse === RESULTS.GRANTED) {
                return true;
            }
            const always = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
            console.log('iOS LOCATION_ALWAYS:', always);
            return always === RESULTS.GRANTED;
        } else if (Platform.OS === 'android') {
            const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            console.log('Android Permission Status:', result);
            return result === RESULTS.GRANTED;
        }
        console.log('Unsupported platform');
        return false;
    };

    useFocusEffect(
        useCallback(() => {
            const fetchLocation = async () => {
                const hasPermission = await requestLocationPermission();
                if (hasPermission) {
                    Geolocation.getCurrentPosition(
                        (info) => {
                            const { latitude, longitude } = info.coords;
                            setLatitude(latitude);
                            setLongitude(longitude);
                            console.log("Latitude:", latitude);
                            console.log("Longitude:", longitude);
                        },
                        (error) => {
                            console.log("Geolocation Error:", error);
                            Alert.alert("Permission Denied", "Unable to fetch location. Please check your settings.");
                        },
                        { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 }
                    );
                } else {
                    Alert.alert("Permission Denied", "Location permission is required to fetch your location.");
                }
            };
            fetchLocation();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            const fetchAddress = async () => {
                if (!latitude && !longitude) return;
                try {
                    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googlePlaceApiKey}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (data.status === "OK") {
                        const formattedAddress = data.results[0].formatted_address;
                        setAddress(formattedAddress);
                        console.log("Address:", formattedAddress);
                    } else {
                        console.log("Unable to fetch address. Status:", data.status);
                    }
                } catch (error) {
                    if (error.response) {
                        console.log('Server responded with an error:', error.response.data);
                    } else if (error.request) {
                        console.log('No response received from the server:', error.request._response);
                    } else {
                        console.log('Error setting up request:', error.message);
                    }
                }
            };
            fetchAddress();
            return () => {
                setEditable(false);
            };
        }, [latitude, longitude, googlePlaceApiKey])
    );

    const validateInput = () => {
        const newErrors = {};
        if (!category.trim()) {
            newErrors.category = 'Category is required.';
        }
        if (!includedTypes.length) {
            newErrors.includedTypes = 'Sub-Category is required.';
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
            return () => {
                setEditable(false);
            };
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
        setEditable(false);
        if (!validateInput()) return;
        try {
            setLoading(true);
            const apiUrl = `${baseUrl}/api/v1/places/searchNearby`;
            const data = { includedTypes: [includedTypes], maxResultCount, locationRestriction: { circle: { center: { latitude, longitude }, radius } } };
            const response = await axios.post(apiUrl, data);
            if (response.status === 200) {
                navigation.navigate('DisplayServices', { places: response.data, includedTypes });
                console.log('Server Response:', response.data);
            } else {
                console.log('Unexpected response:', response.status);
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

    const handleClear = () => {
        placesRef.current?.setAddressText('');
        setAddress('');
        setEditable(true);
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
        <KeyboardAvoidingView style={GlobalStyle.container}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }} >
                <View>
                    {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
                    <View>
                        <Text style={GlobalStyle.headingText}>Search Your Services</Text>
                    </View>
                    {!reset && (
                        <>
                            <GooglePlacesAutocomplete
                                ref={placesRef}
                                placeholder='Search Location'
                                minLength={2}
                                autoFocus={false}
                                returnKeyType={'Search'}
                                listViewDisplayed='auto'
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    const { lat, lng } = details.geometry.location;
                                    setLatitude(lat);
                                    setLongitude(lng);
                                    console.log("Latitude:", lat);
                                    console.log("Longitude:", lng);
                                    setEditable(true);
                                    setAddress(data.description);
                                }}
                                query={{ key: googlePlaceApiKey, language: 'en', types: 'address', }}
                                onFail={(error) => {
                                    console.log("Google Places API Error:", error);
                                    Alert.alert("Error", "Failed to fetch location data. Please try again later.", [{ text: "OK" }]);
                                }}
                                onTimeout={() => {
                                    console.log("Request timed out. Please try again.");
                                    Alert.alert("Timeout", "The request timed out. Please check your connection and try again.");
                                }}
                                renderLeftButton={() => <FontAwesome5 name="search-location" size={20} style={styles.icon} />}
                                renderRightButton={() => (
                                    <FontAwesome
                                        name="times-circle"
                                        size={20}
                                        style={styles.icon}
                                        onPress={handleClear}
                                    />
                                )}
                                renderRow={(data) => (<View><Text style={styles.rowText}>{data.description}</Text></View>)}
                                styles={{ textInputContainer: styles.inputContainer, textInput: styles.textInput, listView: styles.listView }}
                                textInputProps={{
                                    clearButtonMode: "never",
                                    onChangeText: (text) => {
                                        if (editable) {
                                            setAddress(text);
                                        }
                                    }, value: address, placeholderTextColor: colors.secondary, keyboardType: 'default', autoCapitalize: 'words',
                                }}
                                listLoaderComponent={
                                    <View style={styles.loaderContainer}>
                                        <ActivityIndicator size="small" color={colors.primary} />
                                        <Text style={styles.loaderText}>Loading...</Text>
                                    </View>
                                }
                                enablePoweredByContainer={false}
                            />
                            <CustomSelectList
                                onSelect={() => setSelect(true)}
                                setSelected={handleCategorySelect}
                                data={categories}
                                placeholder={Strings.categoryPlaceholder}
                                searchPlaceholder={Strings.searchCatPlaceholder}
                                error={error.category}
                            />
                            {!select && (
                                <>
                                    <CustomSelectList
                                        setSelected={setSubCategory}
                                        data={subcategories}
                                        placeholder={Strings.subCategoryPlaceholder}
                                        searchPlaceholder={Strings.searchSubPlaceholder}
                                        error={error.includedTypes}
                                    />
                                </>
                            )}
                        </>
                    )}
                    <CustomButton title={Strings.otpButton} onPress={handleHome} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SearchServices;

const styles = StyleSheet.create({
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 100,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 0,
    },
    textInput: {
        flex: 1,
        color: colors.primary,
        fontFamily: fonts.Medium,
    },
    icon: {
        paddingHorizontal: 10,
        color: colors.secondary,
    },
    loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    loaderText: {
        marginLeft: 10,
        fontSize: 14,
        color: colors.secondary,
    },
    listView: {
        maxHeight: 250,
        overflow: 'scroll',
    },
    rowText: {
        fontSize: 16,
        color: colors.secondary,
    },
});