import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';
import ForgotPassword from '../screens/forgotPassword';
import store from '../store';
import {Provider} from 'mobx-react';
import {navigationRef} from './navigationRef';
import SplashScreen from '../screens/splashScreen';
import {createDrawerNavigator, DrawerContent} from '@react-navigation/drawer';
import {CustomDrawerContent} from '../components/drawerContent';
import {CarsMap} from '../screens/carsMap';
import AllCarsMap from '../screens/AllCarsMap';
import FuelLevelreports from '../reports/canbusReports/rp_fuelLevelReports';
import FuelGraph from '../reports/canbusReports/rp_fuelGraph';
import Content_FuelLevelReport from '../reports/reportContents/content_fuelLevelReport';
import Content_FuelGraph from '../reports/reportContents/content_fuelGraph';
import Content_ActivitySummary from '../reports/reportContents/content_activitySummary';
import Content_ActivityDetail from '../reports/reportContents/content_activityDetail';
import ModalScreen from '../screens/modal';
import CarsMap1 from '../screens/newCarsMap';
import rp_activitySummary from '../reports/activityReports cpy/rp_activitySummary';
import rp_activityDetail from '../reports/activityReports cpy/rp_activityDetail'
import TestScreen from '../screens/testScreen';
import ReplayScreen from '../screens/ReplayScreen';
import AboutUs from '../screens/AboutUs';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePassword from '../screens/changePassword';
import WebViewScreen from '../screens/WebView';
import EditProfile from '../screens/EditProfile';
import NotificationScreen from '../screens/NotificationsScreen';
import HomeScreen from '../screens/homeScreen';
import SummaryPage from '../screens/SummaryPage';
import CampaignsScreen from '../screens/CampaignScreen';
import Content_IgnitionReport from '../reports/reportContents/content_ignitionBased';
import Content_FuelLevel from '../reports/reportContents/content_fuelLevel';
import AlarmReport from '../reports/journeyReports/rp_alarm';
import IgnitionReport from '../reports/journeyReports/rp_ignitionBased';
import FuelLevel from '../reports/journeyReports/rp_fuelLevel';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerRoot() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      useLegacyImplementation
      initialRouteName="SummaryPage"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 290,
        },
      }}
      >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="SummaryPage" component={SummaryPage} />
      {/* --- CANBUS REPORTS ---*/}
      <Drawer.Group screenOptions={{headerShown: false}}>
        <Drawer.Screen
          name="FuelLevelReports"
          component={FuelLevelreports}
          options={{title: 'Yakıt Seviye Raporu'}}
        />
        <Drawer.Screen
          name="FuelGraph"
          component={FuelGraph}
          options={{title: 'Toplam Yakıt Tüketim Raporu', headerStyle: {}}}
        />
      </Drawer.Group>
      {/* --- ACTIVITY REPORTS ---*/}
      <Drawer.Group screenOptions={{headerShown: false}}>
        <Drawer.Screen
          name="ActivitySummary"
          component={rp_activitySummary}
          options={{title: 'Aktivite-Özet Raporu'}}
        />
        <Drawer.Screen
          name="ActivityDetail"
          component={rp_activityDetail}
          options={{title: 'Aktivite-Detay Raporu'}}
        />
      </Drawer.Group>
      {/* --- JOURNEY REPORTS ---*/}
      <Drawer.Group screenOptions={{headerShown: false}}>
        <Drawer.Screen
          name="AlarmReport"
          component={AlarmReport}
          options={{title: 'Alarm Raporu'}}
        />
        <Drawer.Screen
          name="IgnitionReport"
          component={IgnitionReport}
          options={{title: 'Aktivite-Detay Raporu'}}
        />
        <Drawer.Screen
          name="FuelLevel"
          component={FuelLevel}
          options={{title: 'Yakıt-Seviye Raporu'}}
        />
      </Drawer.Group>
      <Drawer.Group>
        <Drawer.Screen name="CarsMap" component={CarsMap} />
        <Drawer.Screen name="CarsMap1" component={CarsMap1} options={{headerShown: false}}/>
        <Drawer.Screen name="AllCarsMap" component={AllCarsMap} />
        <Drawer.Screen name='ProfileScreen' component={ProfileScreen}/>
        <Drawer.Screen name='AboutUs' component={AboutUs}/>
        <Drawer.Screen name='NotificationScreen' component={NotificationScreen} />
        <Drawer.Screen name='CampaignsScreen' component={CampaignsScreen} />
      </Drawer.Group>
    </Drawer.Navigator>
  );
}
function Navigation() {
  return (
    <Provider {...store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            contentStyle: 'black',
            headerShown: false,
            gestureEnabled: false,
          }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{detachPreviousScreen: false}}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="DrawerRoot"
            component={DrawerRoot}
          />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Group>
            <Stack.Screen
              name="Content_ActivitySummary"
              component={Content_ActivitySummary}
            />
            <Stack.Screen
              name="Content_ActivityDetail"
              component={Content_ActivityDetail}
            />
            {/*JOURNEY REPORTS*/}
            <Stack.Group>
              <Stack.Screen
                name="Content_IgnitionReport"
                component={Content_IgnitionReport}
              />
            </Stack.Group>
            <Stack.Screen name="Modal" component={ModalScreen} />
            <Stack.Screen name='ReplayScreen' component={ReplayScreen}/>
            <Stack.Screen name="TestScreen" component={TestScreen} />
            <Stack.Screen name='ChangePassword' component={ChangePassword} />
            <Stack.Screen name='WebViewScreen' component={WebViewScreen} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default Navigation;
