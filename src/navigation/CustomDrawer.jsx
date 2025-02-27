import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlobalStyle } from '../styles/GlobalStyle';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utility/colors';
import { fonts } from '../utility/fonts';

const CustomDrawer = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#f8f9ff', '#4a6cd1']} style={GlobalStyle.container}>
      <DrawerContentScrollView>
        <DrawerItem
          label={() => (
            <View style={styles.item}>
              <Icon name="home" size={24} color="#007AFF" />
              <Text style={styles.label}>Home Screen</Text>
            </View>
          )}
          onPress={() => navigation.navigate('HomeScreen')}
        />
        <DrawerItem
          label={() => (
            <View style={styles.item}>
              <Icon name="plus-box" size={24} color="#4CAF50" />
              <Text style={styles.label}>Add Services</Text>
            </View>
          )}
          onPress={() => navigation.navigate('AddServices')}
        />
        <DrawerItem
          label={() => (
            <View style={styles.item}>
              <Icon name="delete" size={24} color="#FF5252" />
              <Text style={styles.label}>Delete Services</Text>
            </View>
          )}
          onPress={() => navigation.navigate('DeleteServices')}
        />
        <DrawerItem
          label={() => (
            <View style={styles.item}>
              <Icon name="magnify" size={24} color="#FFA000" />
              <Text style={styles.label}>Search Services</Text>
            </View>
          )}
          onPress={() => navigation.navigate('SearchServices')}
        />
        <DrawerItem
          label={() => (
            <View style={styles.item}>
              <Icon name="logout" size={24} color="#000" />
              <Text style={styles.label}>Log Out</Text>
            </View>
          )}
          onPress={() => navigation.navigate('LandingScreen')}
        />
      </DrawerContentScrollView>
    </LinearGradient>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.dark,
  },
});