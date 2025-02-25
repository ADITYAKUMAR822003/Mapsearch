import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { GlobalStyle } from '../styles/GlobalStyle';
import Strings from '../localization/strings';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';
import Config from 'react-native-config';
import axios from 'axios';
import { SafeAreaView } from 'react-native';

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
      const fetchUserServices = async () => {
        try {
          setLoading(true);
          const apiUrl = `${baseUrl}/api/user-services/${username}`;
          const response = await axios.get(apiUrl);
          if (response.status === 200) {
            setServices(response.data);
            console.log('Server Response:', response.data);
          }
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserServices();
    }, [baseUrl, username])
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.headingContainer}>
      <Text style={styles.headingText}>
        {services.length > 0 ? Strings.yourAdded : Strings.addYour}
      </Text>
    </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.serviceContainer}>
          {services.length > 0 ? (
            services.map((user, index) => (
              <View key={index}>
                {Object.entries(user.services || {}).map(([category, serviceList]) => (
                  <View key={category} style={styles.card}>
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
        <TouchableOpacity style={styles.button} onPress={addServices}>
          <Text style={styles.buttonText}>{Strings.addButton}</Text>
        </TouchableOpacity>
        {services.length > 0 && (
          <>
            <TouchableOpacity style={styles.button} onPress={deleteServices}>
              <Text style={styles.buttonText}>{Strings.deleteButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={searchServices}>
              <Text style={styles.buttonText}>{Strings.searchButton}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#e3eaff',

  },
  overlay: {
    flex: 1,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    //paddingHorizontal: 15,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  serviceContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#F1F8FF',
    marginLeft: 20,
    marginRight: 25,
    padding: 15,
    borderRadius: 12,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceCategoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 18,
    //fontWeight: 500,
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
    paddingHorizontal: 10, 
  },
  button: {
    flex: 1, 
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
  // headingText: {
  //   position: 'sticky',
  //   top: 0,
  //   fontSize: 30,
  //   fontFamily: fonts.SemiBold,
  //   textAlign: 'center',
  //   color: '#1B3B6F',
  //   //marginBottom: 15,
    
  // },
  headingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e3eaff', 
    paddingVertical: 10,
    //zIndex: 1,
    alignItems: 'center',
  },
  
  headingText: {
    fontSize: 30,
    fontFamily: fonts.SemiBold,
    textAlign: 'center',
    color: '#1B3B6F',
  },
  
  scrollViewContent: {
    paddingTop: 70,  
    paddingBottom: 20,
  },
  
});
