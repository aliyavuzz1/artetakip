import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';
import { navigationRef } from '../navigation/navigationRef';

export async function getReplayData(params) {
  let tokenx = userStore.tokenx;
  let carID = carListStore.carReplayID;

  var formData = new FormData();
  formData.append('version', 'v2');
  formData.append('tokenx', tokenx);
  formData.append('reportBeginDay', params.beginDay);
  formData.append('reportBeginTime', params.beginTime);
  formData.append('reportEndDay', params.endDay);
  formData.append('reportEndTime', params.endTime);
  formData.append('carID', carID);
  console.log('FORMDATA', formData);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=rpKonum',
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  })
    .then(function (response) {
        let data = response.data;
        console.log(response.data);
        carListStore.setReplayData(data);
        replayDataFormat(data);
        if (data.length > 1) {
          navigationRef.navigate('ReplayScreen'); 
        }else{
          Alert.alert(
            'Veri bulunamadı',
            'Girdiğiniz tarih aralıklarında araca ait konum bilgisi bulunamadı.',
            [{text: 'TAMAM'}],
            {cancelable: false},
          );
        }
      }
    )
    .catch(function (error) {
      console.log('ERROR',error);
    });
}
let colors = ['#FF4600','#D3D301','#00A423','#00FFD8','#0078FF','#8300FF']

export let replayColors=[];

export const replayDataFormat = (data) => {
  let replayVariant = data;
  let totalIndex = data.length;
  let color ='#000'
  replayColors=[];
  replayVariant = replayVariant.map((item ,index) => {

    if (index < totalIndex/6) {
      color=colors[0];
    }else if (index < totalIndex/3) {
      color=colors[1];
    } else if (index < totalIndex/2) {
      color=colors[2];
    } else if (index < 2*totalIndex/3) {
      color=colors[3];
    } else if (index < 5*totalIndex/6) {
      color=colors[4];
    } else {
      color=colors[5]
    }
    replayColors.push(color);
    return {
      latitude: parseFloat(item.LT),
      longitude : parseFloat(item.LG),
      TA: item.TA,
      AL: item.AL,
      SP: item.SP,
      ST:item.ST,
      RT:item.RT,
      STS:item.STS,
      DS:item.DS,
      AD:item.AD
    };
  });
  carListStore.setPolylineCoordinates(replayVariant);
  console.log(typeof(data)); 
}
