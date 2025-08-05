import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../../store/userStore';
import moment from 'moment';
import reportStore from '../../store/reportStore';
import { navigationRef } from '../../navigation/navigationRef';

export async function getFuelLevel(selectedId,reportDay) {
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('version', 'v2');
  formData.append('tokenx', tokenx);
  formData.append('reportDay',moment(reportDay).format('MM/DD/YYYY'))
  formData.append('plaka', selectedId);
  console.log('FORM:' ,formData,'PARAMS:',selectedId,',--,',reportDay);
  await axios({
    retrieve: true,
    searching: false,
    paging: false,
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=fuelLevel',
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
        console.log('***FUEL-LEVEL*** :', data);
        reportStore.setFuelLevelReport(data);
        navigationRef.navigate('Content_FuelLevel');
       /* if (data && data.length > 0) {
          reportStore.setIgnitionReport(data);
          navigationRef.navigate('Content_FuelLevel');
          reportStore.setLoading(false)
          console.log('Rapor var;');
        } else {
          reportStore.setLoading(false)
          console.log('Rapor yok;');
          Alert.alert(
            'Rapor bulunamadı.',
            'Girdiğiniz tarihte araca ait kontak bilgisi bulunamadı.',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
          return false;
        }*/
      },
    )
    .catch(function (error) {
      console.log('error from getFuelLevel :', error);
      Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}
