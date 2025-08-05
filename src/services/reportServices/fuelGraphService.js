import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../../store/userStore';
import carListStore from '../../store/carListStore';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';

export async function getFuelLevel(params) {
  console.log('FUEL GRAPHA GELDİ', params.plate);
  if (params.selectedId == null) {
    Alert.alert(
      'Hata',
      'Plaka alanı boş olamaz!',
      [{text: 'TAMAM'}],
      {cancelable: false},
    );
    return false;
  }
  let tokenx = userStore.tokenx;
  let plate = params.plate;
  var formData = new FormData();
  formData.append('version', 'v2');
  formData.append('tokenx', tokenx);
  formData.append('reportDay', params.reportDay);
  formData.append('plaka', params.selectedId);
  await axios({
    retrieve: true,
    searching: false,
    paging: false,
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=fuelLevel',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  })
    .then(
      await function (response) {
        let data = response.data;
        console.log('RESponse.GRAPHH',data);
      }
    )
    .catch(function (error) {
      console.log('Fuel Graph çalışmadı', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}


export const activityDetailtoExcel = (data) => {
  let excelVariant = data;
  excelVariant = excelVariant.map(item => {
    return {
      Plaka: item.PL,
      Tarih: item.TA,
      Mesafe: item.DS,
      Kontak: item.ST,
      Alarm: item.AL,
      Adres: item.AD,
    };
  });
  reportStore.setExcelVariant(excelVariant);
}
