import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../../store/userStore';
import carListStore from '../../store/carListStore';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';

export async function getActivitySummary(params) {
  console.log('AKTİVİTE ÖZETE GELDİ');
  let tokenx = userStore.tokenx;

  var formData = new FormData();
  formData.append('version', 'v2');
  formData.append('tokenx', tokenx);
  formData.append('reportBeginDay', params.beginDay);
  formData.append('reportBeginTime', params.beginTime);
  formData.append('reportEndDay', params.endDay);
  formData.append('reportEndTime', params.endTime);
  formData.append('plaka[]', params.selectedId);
  await axios({
    retrieve: true,
    searching: false,
    paging: false,
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=activitySummary',
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
        console.log('response :', data);
        if (typeof response.data == 'string') {
          Alert.alert(
            'Hata',
            'Tarih aralığı 35 günden büyük olamaz!',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
          return false;
        } else if (response.data[0].plaka == null) {
          Alert.alert('Hata', 'Lütfen Plaka Seçiniz!', [{text: 'TAMAM'}], {
            cancelable: false,
          });
        } else if (response.data[0].adres1 == '__veriyok_111204') {
          Alert.alert(
            'Hata',
            'Belirttiğiniz tarih aralıklarında veri bulunamadı!',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
        } else {
          reportStore.setAdress1(data[0].adres1);
          reportStore.setAdress2(data[0].adres2);
          reportStore.setLAT1(data[0].LAT1);
          reportStore.setLAT2(data[0].LAT2);
          reportStore.setLNG1(data[0].LNG1);
          reportStore.setLNG2(data[0].LNG2);
          reportStore.setReportPlate(data[0].plaka);
          reportStore.setFark(data[0].fark);
          navigationRef.navigate('Content_ActivitySummary', {
            /*
              LAT1: data.LAT1, LAT2:data.LAT2 , LNG1: data.LNG1 , LNG2: data.LNG2, adres1:data.adres1 , adres2: data.adres2 , fark:data.fark, mesafe1:data.mesafe1, mesafe2:data.mesafe2, plaka:data.plaka
          */
          });
        }
      },
    )
    .catch(function (error) {
      console.log('error from image :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}
