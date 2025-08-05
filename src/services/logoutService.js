import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';
import { navigationRef } from '../navigation/navigationRef';

export async function clearM_TOKEN() {
  let tokenx = userStore.tokenx;
  let userID = userStore.ID;
  console.log('Plaka Content', tokenx);
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('user_id', userID);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=logout',
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
        console.log('LOGOUT RESPONSE', data);
          Alert.alert('Başarılı', 'Güvenli çıkış yaptınız.', [{text: 'TAMAM'}], {cancelable: false})
      }
    )
    .catch(function (error) {
      clearM_TOKEN();
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}
