import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';

export async function getCarList(type) {
  console.log('CAR LİSTE GELDİ');
  let tokenx = userStore.tokenx;
  console.log(tokenx);

  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  type !== null ? formData.append('type',type) : null;
  console.log('REFRESHINGGGGGG -<-<-<-<', formData);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=tumaraclar3&type=',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  }).then(
       function (response) {
        let data = response.data;
        switch (type) {
          case 'hareketli':
            carListStore.setGreenCars(response.data);
            break;
          case 'rolanti':
            carListStore.setYellowCars(response.data);
            break;
          case 'duran':
            carListStore.setRedCars(response.data);
            break;
          case 'pasif':
            carListStore.setBlackCars(response.data);
            break;
          default:
          carListStore.setCar(data);
            break;
        }
        console.log('response :',type, data);
      },
    )
    .catch(function (error) {
      console.log('error from image :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

