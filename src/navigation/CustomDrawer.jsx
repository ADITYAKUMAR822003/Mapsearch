import * as React from 'react';
import { StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

const CustomDrawer = () => {
  const navigation = useNavigation();

  const homeScreen = () => {
    navigation.navigate('HomeScreen');
  };
  const addServices = () => {
    navigation.navigate('AddServices');
  };
  const deleteServices = () => {
    navigation.navigate('DeleteServices');
  };
  const searchServices = () => {
    navigation.navigate('SearchServices');
  };
  const logOut = () => {
    navigation.navigate('LandingScreen');
  };

  return (
    <DrawerContentScrollView>
      <DrawerItem label="Home Screen" onPress={homeScreen} />
      <DrawerItem label="Add Services" onPress={addServices} />
      <DrawerItem label="Delete Services" onPress={deleteServices} />
      <DrawerItem label="Search Services" onPress={searchServices} />
      <DrawerItem label="Log Out" onPress={logOut} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});