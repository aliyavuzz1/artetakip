
import React, {Component, useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Header ,Text} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { useRoute } from '@react-navigation/native';
import sellerStore from '../store/sellerStore';
import WebView from 'react-native-webview';
import sellerUI from '../../assets/sellerUI/sellerUI';

const  WebViewScreen = (params) => {
    const route = useRoute();
    const {lat} = route.params
    const {lng} = route.params
    console.log(params,'poidddd',lat);
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#FAF8F1'}}>
          <Header
            backgroundColor={sellerUI.color3}
            leftComponent={
              <View style={styles.headerRight}>
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    navigationRef.goBack();
                  }}>
                  <Ionicons name="return-up-back" color={sellerUI.color4} size={26} />
                </Pressable>
              </View>
            }
            centerComponent={
              <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text h4 h4Style={{fontSize:21, alignSelf:'center', fontWeight:'600',marginTop:3, color:sellerUI.color4}} >Sokak Görünümü</Text>
              </View>
            }
          />
          <View style={{height:'100%'}} >
          {/*<WebView 
            source={{
              html:
                '<iframe width="600" height="450"style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyC_7EbDO10A0lgnYWzyDK5cEqga45ZUgk4&q=Space+Needle,Seattle+WA"></iframe>'
                }}>
            </WebView>*/}
            <WebView
            allowsBackForwardNavigationGestures={false}
            source={{uri: 'https://www.google.com/maps/@41.32132,26.2414,0a,80y,45h,90t/data=!3m1!1e1'}}>
            </WebView>
          </View>
        </View>
      </>
    );
  }


export default WebViewScreen;

const styles = StyleSheet.create({
  datePicker: {
    borderWidth: 0.6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent:'flex-end'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf:'flex-end',
    height: '60%',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
