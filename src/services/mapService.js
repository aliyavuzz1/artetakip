import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';

export default async function getCarsMap(ID) {
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('carID', ID);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=arac_getir',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  })
    .then(
      function (response) {
        let data = response.data;
        if (
          response.data ===
          'Sistem kisa bir sureligine bakima alindi. Bir sure sonra tekrar deneyiniz.'
        ) {
          Alert.alert(
            'Bağlantı Hatası',
            'İnternet bağlantınızı kontrol edip tekrar deneyin!',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
        } else {
          carListStore.setMapCar(response.data);
          carListStore.setMapLG(data.LG);
          carListStore.setMapLT(data.LT);
          carListStore.setMapSpeed(data.SP);
          carListStore.setMapAdress(data.LK);
          carListStore.setMapDate(data.KT);
          carListStore.setMapPlate(data.P);
          carListStore.setMapID(data.ID);
          carListStore.setMapST(data.ST);
          carListStore.setMapRotate(data.RT);
          carListStore.setTemperature(data.TEMP);
          console.log('====================================');
          console.log('HARİTA SET EDİLDİ', response.data);
          console.log('====================================');
        }
      },
    )
    .catch(function (error) {
      console.log('error from image :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

export async function getAllCarsMap() {
  let tokenx = userStore.tokenx;
  console.log('UPDATE MAP FONKSİYOnU');

  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=tumaraclar',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  })
    .then(
      function (response) {
        let data = response.data;
        console.log('UPDATE MAP DATA :', data);
        if (
          response.data ===
          'Sistem kisa bir sureligine bakima alindi. Bir sure sonra tekrar deneyiniz.'
        ) {
          Alert.alert(
            'Bağlantı Hatası',
            'İnternet bağlantınızı kontrol edip tekrar deneyin!',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
          navigationRef.navigate('DrawerRoot', {screen: 'Home'});
          return false;
        } else {
          carListStore.setAllCarsMap(data);
        }
      },
    )
    .catch(function (error) {
      Alert.alert('Hata', error, [{text: 'TAMAM'}], {cancelable: false});
    });
}

export async function changeMarkersIcon(icon,ID) {
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('icon', icon);
  formData.append('carID', ID);
  console.log(formData);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=mobil_icon_change',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  })
    .then(
      function (response) {
        console.log(response.data);
      },
    )
    .catch(function (error) {
      Alert.alert('Hata', error, [{text: 'TAMAM'}], {cancelable: false});
    });
}
