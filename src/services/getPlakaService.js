import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';

export async function getPlakaService(getPlateWhere) {
  let tokenx = userStore.tokenx;
  console.log('Plaka Content', tokenx);
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  if (getPlateWhere !=  null || undefined) {
    formData.append('where', getPlateWhere)
  }
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=tumaraclar2',
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
        console.log('PLAKA LİSTESİİİİİİİİ ->', data);
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
          carListStore.plate = [];
          data.forEach(data => {
            if (data.P !== ('' || '-' || ' ')) {
              carListStore.setPlate(data);
            } else null;
          });
          console.log('PLAKA DİZİSİİ', carListStore.plate);
        }
      },
    )
    .catch(function (error) {
      console.log('error from image :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}
