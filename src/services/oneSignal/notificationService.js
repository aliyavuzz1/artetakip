import React, {useEffect} from 'react';
import axios from 'axios';
import userStore from '../../store/userStore';
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function sendM_TOKEN() {
  let M_TOKEN = userStore.M_TOKEN;
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('M_TOKEN', M_TOKEN);
  formData.append('USERID', userStore.ID);
  formData.append('tokenx',tokenx );
  formData.append('version', 'v2');
  console.log(
    M_TOKEN,'<------ M_TOKENNNN');
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=update_mtoken',
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
        console.log('====================================');
        console.log('?  RESPONSE (VARSA)',response.data);
        console.log('====================================');
      },
    )
    .catch(function (error) {
      console.log('NOTIFICATIONS ERRROORRRR :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

//http://m1.aragis.com/mobilservice/ajax.php?act=rpKonum


export async function getNotifInfo() {
  let M_TOKEN = userStore.M_TOKEN;
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('USERID', userStore.ID);
  formData.append('tokenx',tokenx );
  formData.append('version', 'v2');
  console.log(
    M_TOKEN,'<------ M_TOKENNNN');
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=notif_info',
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
        console.log('====================================');
        console.log('RESPONSE ',response.data[0].NOTIFICATION_ON == 1 ? true : false);
        console.log('====================================');
        response.data[0].NOTIFICATION_ON == 1 ? userStore.setUserNotifStatus(true) : userStore.setUserNotifStatus(false); 
      },
    )
    .catch(function (error) {
      console.log('NOTIFICATIONS ERRROORRRR :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}


export async function switchNotif() {
  let M_TOKEN = userStore.M_TOKEN;
  let tokenx = userStore.tokenx;
  let notif_value = userStore.userNotifStatus ? 0  : 1;
  var formData = new FormData();
  formData.append('USERID', userStore.ID);
  formData.append('notif_value',notif_value)
  formData.append('tokenx',tokenx );
  formData.append('version', 'v2');
  console.log('FORMDATA',formData);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/ajax.php?act=notif_switch',
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
        console.log('SWTCH??',response.data);
        setTimeout(()=>{response.data[0].NOTIFICATION_ON == 1 ? userStore.setUserNotifStatus(true) : userStore.setUserNotifStatus(false) } ,800) 
      },
    )
    .catch(function (error) {
      console.log('NOTIFICATIONS ERRROORRRR :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}


export async function getCampaigne() {
  let tokenx = userStore.tokenx;
  const bayiid = await AsyncStorage.getItem('bayiid');
  var formData = new FormData();
  formData.append('bayiid', bayiid);
  formData.append('tokenx',tokenx );
  formData.append('version', 'v2');
  console.log(formData);
  await axios({
    url: 'http://m1.aragis.com/mobilservice/v2api/campaign.php',
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
        console.log('RESPONSE ',response.data);
        userStore.setCampaign(response.data);
      },
    )
    .catch(function (error) {
      console.log('NOTIFICATIONS ERRROORRRR :', error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}