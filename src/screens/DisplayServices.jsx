// import React from 'react';
// import { Text, View, ScrollView, StyleSheet, } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { GlobalStyle } from '../styles/GlobalStyle';
// import { colors } from '../utility/colors';
// import { fonts } from '../utility/fonts';

// const DisplayServices = () => {
//     const navigation = useNavigation();
//     const route = useRoute();
//     const { places, includedTypes } = route.params || {};

//     return (
//         <View style={GlobalStyle.container}>
//             <ScrollView>
//                 {Array.isArray(places) && places.length > 0 && !places.some(place => place?.error) ? (
//                     <>
//                         <Text style={GlobalStyle.headingText}>List of {includedTypes} nearby</Text>
//                         {places.map((place, index) => (
//                             <View key={index} style={styles.card}>
//                                 {place?.displayName && <Text style={styles.name}>{place.displayName}</Text>}
//                                 {['formattedAddress', 'rating', 'userRatingCount', 'paymentOptions', 'nationalPhoneNumber'].map((key) => {
//                                     const keyDisplayNameMap = {
//                                         formattedAddress: 'Address',
//                                         rating: 'Rating',
//                                         userRatingCount: 'User Ratings',
//                                         paymentOptions: 'Payment Options',
//                                         nationalPhoneNumber: 'Phone Number',
//                                     };
//                                     const value = place[key] !== undefined && place[key] !== null ?
//                                         (key === 'paymentOptions' && typeof place[key] === 'object' ?
//                                             Object.entries(place[key]).map(([option, value]) => `${option}: ${value ? 'Yes' : 'No'}`).join(', ') :
//                                             typeof place[key] === 'object' ? JSON.stringify(place[key], null, 2) : place[key]
//                                         ) : 'N/A';
//                                     return (
//                                         <View key={key} style={styles.item}>
//                                             <Text style={styles.label}>{keyDisplayNameMap[key] || key}:</Text>
//                                             <Text style={styles.value}>{value}</Text>
//                                         </View>
//                                     );
//                                 })}
//                                 {Object.keys(place)
//                                     .filter(key => !['displayName', 'formattedAddress', 'rating', 'userRatingCount', 'paymentOptions', 'nationalPhoneNumber'].includes(key))
//                                     .map((key) => (
//                                         <View key={key} style={styles.item}>
//                                             <Text style={styles.label}>{key}:</Text>
//                                             <Text style={styles.value}>
//                                                 {place[key] !== undefined && place[key] !== null ? (typeof place[key] === 'object' ? JSON.stringify(place[key], null, 2) : place[key]) : 'N/A'}
//                                             </Text>
//                                         </View>
//                                     ))}
//                             </View>
//                         ))}
//                     </>
//                 ) : (
//                     <Text style={GlobalStyle.headingText}>No Service Available for {includedTypes}</Text>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };

// export default DisplayServices;

// const styles = StyleSheet.create({
//     card: {
//         backgroundColor: '#fff',
//         padding: 15,
//         marginVertical: 10,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 3 },
//         elevation: 3,
//     },
//     name: {
//         fontSize: 20,
//         fontFamily: fonts.SemiBold,
//         textAlign: 'center',
//         color: colors.primary,
//     },
//     item: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 4,
//     },
//     label: {
//         color: colors.primary,
//         fontFamily: fonts.SemiBold,
//         marginRight: 8,
//         width: 130,
//         fontSize: 16,
//     },
//     value: {
//         color: colors.primary,
//         fontSize: 16,
//         flex: 1,
//         flexWrap: 'wrap',
//     },
//     noService: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     noServiceText: {
//         fontSize: 16,
//         color: 'gray',
//     },
// });

import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GlobalStyle } from '../styles/GlobalStyle';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

const DisplayServices = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [places, setPlaces] = useState([]);
    const [includedTypes, setIncludedTypes] = useState('');

    useEffect(() => {
        if (route.params) {
            // console.log("Received Route Params:", route.params);
            setPlaces(route.params.places || []);
            setIncludedTypes(route.params.includedTypes || '');
        }
    }, [route.params]);

    // const handleGoBack = () => {
    //     navigation.navigate('Services', { includedTypes });
    // };


    return (
        <View style={styles.container}>
            {/* Sticky Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.headingText}>List of {includedTypes} Nearby</Text>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {places.length > 0 ? (
                    places.map((place, index) => (
                        <View key={index} style={styles.resultCard}>
                            <Text style={styles.name}>{place.displayName}</Text>
                            <Text style={styles.info}><Text style={styles.label}>Address:</Text> {place.formattedAddress}</Text>
                            { <Text style={styles.info}><Text style={styles.label}>Rating:</Text> {place.rating} 
                             {/* (based on {place.userRatingCount} reviews) */}
                             </Text>  }

                            {/* Payment Options Handling */}

                            {place.paymentOptions && typeof place.paymentOptions === "object" ? (

                                <View style={styles.paymentList}>
                                    <Text style={styles.label}>Payment Options:</Text>
                                    <Text style={styles.info}>- Credit Cards: {place.paymentOptions.acceptsCreditCards ? "Yes" : "No"}</Text>
                                    <Text style={styles.info}>- Cash Only: {place.paymentOptions.acceptsCashOnly ? "Yes" : "No"}</Text>
                                </View>
                            ) : (
                                <Text style={styles.label}>Payment Options: N/A</Text>
                            )}

                            <Text style={styles.info}><Text style={styles.label}>Phone Number:</Text> {place.nationalPhoneNumber || "N/A"}</Text>
                            {place.subcategory && <Text style={styles.info}><Text style={styles.label}>Subcategory:</Text> {place.subcategory}</Text>}
                        </View>
                    ))
                ) : (
                    <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>No Services Available for {includedTypes}</Text>
                    </View>
                )}

                {/* <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                    <Text style={styles.buttonText}>Back To Service Page</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </View>
    );
};

export default DisplayServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3eaff',
        //backgroundColor: '#8694a4',
        alignItems: 'center',
        paddingBottom: 10,

    },
    topBar: {
        position: 'sticky',
        top: 0,
        //backgroundColor: 'white', 
        padding: 5,
        // borderBottomWidth: 3,
        borderBottomColor: 'black',
        alignItems: 'center',
        // borderWidth: 3,
    },
    headingText: {
        fontSize: 28,
        fontFamily: fonts.SemiBold,
        color: 'black',
        //textDecorationLine: 'underline',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 200,
        alignItems: 'center',
        color: 'black',
        // borderWidth: 2,
        // borderColor: '#131010',
        // marginBottom: 20,
    },
    resultCard: {
        borderWidth: 2,
        borderColor: '#131010',
        padding: 20,
        marginTop: 25,
        marginBottom: -20,
        borderRadius: 10,
        backgroundColor: '#F1F8FF',
        width: '90%',
        alignSelf: 'center',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    name: {
        fontSize: 22,
        fontFamily: fonts.SemiBold,
        textAlign: 'center',
        color: 'rgb(27, 27, 84)',
        //marginBottom: 1,
        textDecorationLine: 'underline',
    },
    label: {
        fontFamily: fonts.SemiBold,
        color: 'rgb(27, 27, 84)',
        fontSize: 16,
    },
    info: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
        fontWeight: '600',
    },
    paymentList: {
        paddingLeft: 10,
    },
    noResults: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#eae7dd',
        width: '50%',
        padding: 20,
        marginTop: 50,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 5,
    },
    noResultsText: {
        fontSize: 18,
        color: 'gray',
    },
    button: {
        backgroundColor: '#618e66',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: fonts.SemiBold,
    },
});

