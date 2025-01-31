import React from 'react';
import { Text, View, ScrollView, StyleSheet, } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalStyle } from '../styles/GlobalStyle';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

const DisplayServices = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { places, includedTypes } = route.params || {};

    return (
        <View style={GlobalStyle.container}>
            <ScrollView>
                {Array.isArray(places) && places.length > 0 && !places.some(place => place?.error) ? (
                    <>
                        <Text style={GlobalStyle.headingText}>Available Services</Text>
                        {places.map((place, index) => (
                            <View key={index} style={styles.card}>
                                {['displayName', 'formattedAddress', 'rating', 'userRatingCount', 'paymentOptions', 'nationalPhoneNumber'].map((key) => {
                                    const keyDisplayNameMap = {
                                        displayName: 'Name',
                                        formattedAddress: 'Address',
                                        rating: 'Rating',
                                        userRatingCount: 'User Ratings',
                                        paymentOptions: 'Payment Options',
                                        nationalPhoneNumber: 'Phone Number',
                                    };
                                    const value = place[key] !== undefined && place[key] !== null ?
                                        (key === 'paymentOptions' && typeof place[key] === 'object' ?
                                            Object.entries(place[key]).map(([option, value]) => `${option}: ${value ? 'Yes' : 'No'}`).join(', ') :
                                            typeof place[key] === 'object' ? JSON.stringify(place[key], null, 2) : place[key]
                                        ) : 'N/A';
                                    return (
                                        <View key={key} style={styles.item}>
                                            <Text style={styles.label}>{keyDisplayNameMap[key] || key}:</Text>
                                            <Text style={styles.value}>{value}</Text>
                                        </View>
                                    );
                                })}
                                {Object.keys(place)
                                    .filter(key => !['displayName', 'formattedAddress', 'rating', 'userRatingCount', 'paymentOptions', 'nationalPhoneNumber'].includes(key))
                                    .map((key) => (
                                        <View key={key} style={styles.item}>
                                            <Text style={styles.label}>{key}:</Text>
                                            <Text style={styles.value}>
                                                {place[key] !== undefined && place[key] !== null ? (typeof place[key] === 'object' ? JSON.stringify(place[key], null, 2) : place[key]) : 'N/A'}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        ))}
                    </>
                ) : (
                    <Text style={GlobalStyle.headingText}>No Service Available for {includedTypes}</Text>
                )}
            </ScrollView>
        </View>
    )
}

export default DisplayServices;

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    label: {
        color: colors.primary,
        fontFamily: fonts.SemiBold,
        marginRight: 8,
        width: 130,
        fontSize: 16,
    },
    value: {
        color: colors.primary,
        fontSize: 16,
        flex: 1,
        flexWrap: 'wrap',
    },
    noService: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noServiceText: {
        fontSize: 16,
        color: 'gray',
    },
});