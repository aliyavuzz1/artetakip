import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';

const isAuthValid = async () => {
  let isLoggedIn = await AsyncStorage.getItem('tokenx');
  console.log('TOKEEEEENX', isLoggedIn);
  if (isLoggedIn != null) {
    navigationRef.navigate('DrawerRoot', {screen: 'HomeScreen'});
  } else {
    navigationRef.navigate('Login');
  }
};

export default function SplashScreen() {
  useEffect(() => {
    isAuthValid();
  }, []);

  return (
    <SafeAreaView style={styles.centeredView}>
      <ActivityIndicator size={56} color="#E57A00"></ActivityIndicator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
