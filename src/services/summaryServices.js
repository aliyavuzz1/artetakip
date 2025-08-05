import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';

export default async function getDailyTotalDistance() {
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('USERID',userStore.ID);
  console.log(formData);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=daily_total_km',
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
          userStore.setTotalKilometer(response.data);
        }
      },
    )
    .catch(function (error) {
      console.log('error from image :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
};
export async function getTotalAlarms() {
    let tokenx = userStore.tokenx;
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('USERID',userStore.ID);
    console.log(formData);
    await axios({
      url: 'http://m1.aragis.com/mobilservice/ajax.php?act=ihlal_sayisi',
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
              userStore.setTotalAlarms(response.data);
          }
        },
      )
      .catch(function (error) {
        console.log('error from image :', error);
        //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  };

  export async function getSummaryofCarsStatus() {
    let tokenx = userStore.tokenx;
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('USERID',userStore.ID);
    console.log(formData);
    await axios({
      url: 'http://m1.aragis.com/mobilservice/ajax.php?act=arac_sayi_durum',
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
              console.log('Summary status',response.data);
              userStore.setSummaryOfAllCarsStatus(response.data);
       
          }
        },
      )
      .catch(function (error) {
        console.log('error from image :', error);
        //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  };


  export async function getAlarmsDetail() {
    let tokenx = userStore.tokenx;
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('USERID',userStore.ID);
    console.log(formData);
    await axios({
      url: 'http://m1.aragis.com/mobilservice/ajax.php?act=ihlal_detay',
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
              console.log('ALARM DETAILS',response.data);
              userStore.setTotalAlarms(response.data);
          }
        },
      )
      .catch(function (error) {
        console.log('error from image :', error);
        //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  };