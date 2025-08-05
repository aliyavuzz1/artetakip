import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../../store/userStore';
import carListStore from '../../store/carListStore';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';

export async function getActivityDetail(params) {
  reportStore.setLoading(true);
  console.log('AKTİVİTE DETAYA GELDİ', params.plate);
  if (params.selectedId == null) {
    reportStore.setLoading(false);
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
  formData.append('reportBeginDay', params.beginDay);
  formData.append('reportBeginTime', params.beginTime);
  formData.append('reportEndDay', params.endDay);
  formData.append('reportEndTime', params.endTime);
  formData.append('plaka', params.selectedId);
  console.log('FORM VARIABLES',formData);
  await axios({
    retrieve: true,
    searching: false,
    paging: false,
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=activityDetail',
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
        //console.log('response :', data);
        if (typeof response.data == 'string') {
          reportStore.setLoading(false)
          Alert.alert(
            'Hata',
            'Tarih aralığı 35 günden büyük olamaz!',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
          return false;
        } else {
          //console.log(data);
          reportStore.setTotalIndex(data.length);
          reportStore.setCarActDetail(data);
          reportStore.setReportPlate(params.plate);
          //reportStore.setFark(data[0].fark);
          navigationRef.navigate('Content_ActivityDetail', {
          });
          reportStore.setLoading(false)
        }
      },
    )
    .catch(function (error) {
      console.log('Aktivite Detay çalışmadı', error);
      reportStore.setLoading(false)
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
