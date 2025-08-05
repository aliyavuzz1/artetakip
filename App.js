import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Navigation from './src/navigation/navigation';
import MapView, {enableLatestRenderer} from 'react-native-maps';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import userStore from './src/store/userStore';
import { i18n } from './src/localization';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
console.log('OneSignal:', OneSignal);


// OneSignal Initialization
OneSignal.initialize('4e00d66e-9d48-4c7e-9dbc-cd78239bbfa0');
i18n.defaultLocale = 'tr';
i18n.locale = 'tr';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  console.log('DEFAULT LOCALE : tr');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('4e00d66e-9d48-4c7e-9dbc-cd78239bbfa0');
    OneSignal.User.getOnesignalId().then(playerId =>{
      console.log("Player ID (OneSignal ID):",playerId);
    });
    try {
      const externalId = OneSignal.User.getExternalId();
      console.log('External ID:', externalId);
    } catch (error) {
      console.error('Error fetching external ID:', error);
    }
    async function getPushSubscriptionId() {
      try {
        let pushId = await OneSignal.User.pushSubscription.getIdAsync();
        while (pushId == null) {
          pushId = await OneSignal.User.pushSubscription.getIdAsync();
        }
        userStore.setM_TOKEN(pushId + '#' + '4e00d66e-9d48-4c7e-9dbc-cd78239bbfa0');
        if (pushId) {
          console.log('Push Subscription ID:', pushId);
        } else {
          console.log('Push Subscription ID bulunamadı!');
        }
      } catch (error) {
        console.error('Push Subscription ID alınırken hata oluştu:', error);
      }
    }

    getPushSubscriptionId();
   
    OneSignal.Notifications.requestPermission(true).then(granted => {
      console.log(granted ? 'Bildirim izni verildi.' : 'Bildirim izni reddedildi.');
    });
    OneSignal.Notifications.addEventListener('notificationWillShowInForeground', event => {
      console.log('Foregroundda gelen bildirim:', event);
      OneSignal.Notifications.requestPermission().then(permission => {
        console.log('Bildirim izni durumu:', permission); // "granted" veya "denied" döner
      });
      event.complete(event.notification);
    });

    // Temizlik
    return () => {
      OneSignal.Notifications.removeEventListener('notificationWillShowInForeground');
      OneSignal.Notifications.removeEventListener('notificationOpened');
    };
  }, []);

  return (
      <Navigation/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
});

export default App;




