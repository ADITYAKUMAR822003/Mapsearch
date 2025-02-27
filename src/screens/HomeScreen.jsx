import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';
import Config from 'react-native-config';
import axios from 'axios';

const HomeScreen = () => {
  const navigation = useNavigation();
  const baseUrl = Config.API_BASE_URL;
  const route = useRoute();
  const { username } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  const addServices = () => navigation.navigate('AddServices');
  const deleteServices = () => navigation.navigate('DeleteServices');
  const searchServices = () => navigation.navigate('SearchServices');

  useFocusEffect(
    useCallback(() => {
      const userServices = async () => {
        try {
          setLoading(true);
          const apiUrl = `${baseUrl}/api/user-services/${username}`;
          const response = await axios.get(apiUrl);
          if (response.status === 200) {
            setServices(response.data);
            console.log('Server Response:', response.data);
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

  return (
    <SafeAreaView style={GlobalStyle.container}>
      {loading && <ActivityIndicator size={50} color={colors.success} style={GlobalStyle.loader} />}
      <View style={GlobalStyle.headingContainer}>
        <Text style={GlobalStyle.headingText}>
          {services && services.some(user => Object.keys(user.services || {}).length > 0) ? Strings.yourAdded : Strings.addYour}
        </Text>
      </View>
      <ScrollView>
        <View>
          {services && services.length > 0 && services.some(user => Object.keys(user.services || {}).length > 0) ? (
            services.map((user, index) => (
              <View key={index}>
                {Object.entries(user.services || {}).map(([category, serviceList]) => (
                  <View key={category} style={GlobalStyle.card}>
                    <Text style={styles.serviceCategoryText}>{category}</Text>
                    {serviceList.map((service, idx) => (
                      <Text key={idx} style={styles.serviceText}>{service}</Text>
                    ))}
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.noServicesText}>{Strings.noServices}</Text>
          )}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButtonWrapper} onPress={addServices}>
          <Text style={styles.loginText}>{Strings.addButton}</Text>
        </TouchableOpacity>
        {services && services.length > 0 && services.some(user => Object.keys(user.services || {}).length > 0) && (
          <>
            <TouchableOpacity style={styles.loginButtonWrapper} onPress={deleteServices}>
              <Text style={styles.loginText}>{Strings.deleteButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButtonWrapper} onPress={searchServices}>
              <Text style={styles.loginText}>{Strings.searchButton}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  serviceCategoryText: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  serviceText: {
    fontSize: 18,
    color: colors.secondary,
    marginLeft: 10,
  },
  noServicesText: {
    fontSize: 16,
    color: colors.secondary,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  loginButtonWrapper: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: 10,
  },
  loginText: {
    color: colors.light,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
});