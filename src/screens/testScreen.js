import AsyncStorage from "@react-native-async-storage/async-storage";

import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import createPlateIcon from '../components/plateIconCreator';
const TestScreen = () => {
  return (
    <>
      <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
        <Text>TEST SCREEN</Text>
        <View
          style={{
            padding: 3,
            backgroundColor: a,
            borderWidth: 2,
            borderRadius: 5,
            flexDirection: 'row',
          }}>
          <View
            style={{
              backgroundColor: 'blue',
              marginLeft: -3,
              marginVertical: -3,
              alignItems: 'center',
            }}>
            <Text style={{alignSelf: 'center', marginTop: 3, padding: 5}}>
              TR
            </Text>
          </View>
          <Text style={{padding: 3, fontWeight: '800', fontSize: 18}}>{b}</Text>
        </View>
        {createPlateIcon('red', '34asd54')}
      </SafeAreaView>
    </>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  search: {
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    marginTop: 15,
    borderRadius: 10,
  },
});
