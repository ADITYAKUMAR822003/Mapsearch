import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRoute } from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';
import HomeScreen from '../screens/HomeScreen';
import AddServices from '../screens/AddServices';
import DeleteServices from '../screens/DeleteServices';
import SearchServices from '../screens/SearchServices';
import DisplayServices from '../screens/DisplayServices';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const route = useRoute();
  const { username } = route.params || {};

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} initialParams={{ username }} />
      <Drawer.Screen name="AddServices" component={AddServices} initialParams={{ username }} />
      <Drawer.Screen name="DeleteServices" component={DeleteServices} initialParams={{ username }} />
      <Drawer.Screen name="SearchServices" component={SearchServices} initialParams={{ username }} />
      <Drawer.Screen name="DisplayServices" component={DisplayServices} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
