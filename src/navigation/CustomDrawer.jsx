// import * as React from 'react';
// import { StyleSheet } from 'react-native';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { useNavigation } from '@react-navigation/native';

// const CustomDrawer = () => {
//   const navigation = useNavigation();

//   const homeScreen = () => {
//     navigation.navigate('HomeScreen');
//   };
//   const addServices = () => {
//     navigation.navigate('AddServices');
//   };
//   const deleteServices = () => {
//     navigation.navigate('DeleteServices');
//   };
//   const searchServices = () => {
//     navigation.navigate('SearchServices');
//   };
//   const logOut = () => {
//     navigation.navigate('LandingScreen');
//   };

//   return (
//     <DrawerContentScrollView>
//       <DrawerItem label="Home Screen" onPress={homeScreen} />
//       <DrawerItem label="Add Services" onPress={addServices} />
//       <DrawerItem label="Delete Services" onPress={deleteServices} />
//       <DrawerItem label="Search Services" onPress={searchServices} />
//       <DrawerItem label="Log Out" onPress={logOut} />
//     </DrawerContentScrollView>
//   );
// };

// export default CustomDrawer;

// const styles = StyleSheet.create({});

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const CustomDrawer = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#f8f9ff', '#4a6cd1']} style={styles.container}>
      <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}>
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
              <Icon name="logout" size={24} color="#9E9E9E" />
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
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
