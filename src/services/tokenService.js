import React from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import {getCarToHome} from '../components/getCarToHomeP';
import getDailyTotalDistance, { getAlarmsDetail, getSummaryofCarsStatus, getTotalAlarms } from './summaryServices';
import { getSellerInfo } from './getSellerService';
import { getCarList } from './carListService';
import { oneSignalSetId } from './oneSignal/setExternalUID';
import { getDeviceState } from './oneSignal/getDeviceState';
import { sendM_TOKEN } from './oneSignal/notificationService';
export async function getTokenCode(username, password,checked) {
  console.log('buraya geldiiii');

  AsyncStorage.setItem('kullanici', username);
  var formData = new FormData();
  formData.append('kullanici', username);
  formData.append('sifre', password);
  formData.append('M_TOKEN', '');
  formData.append('version', 'v2');
  console.log('FORM DATA => ',formData);
  console.log('USERNAME:', username, 'PASS', password);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/login.php',
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
        console.log('token response :', response.data);
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
          userStore.setVisible2(false);
        } else {
          isLoginValid(response.data,username,password,checked);
        }
      },
    )
    .catch(function (error) {
      Alert.alert('Bağlantı Hatası', error, [{text: 'TAMAM'}], {cancelable: false})
      userStore.setVisible2(false);
    });
    console.log('Bitti');
}

export const isLoginValid = async (data,username,password,checked) => {
  let id = parseInt(data.id);
  console.log('========22222222222222==============');
  console.log(data);
  console.log('========22222222222222=============');
  let BAYIBANNED = data.BAYIBANNED;
  console.log(id);
  if (data.BAYIBANNED == 1) {
    Alert.alert('Hata','Bu kullanıcının sisteme erişimi engellenmiştir. Yetkiliniz ile iletişime geçin.',[{ text: 'Tamam'}]);
    navigationRef.navigate('Login');
    userStore.setVisible2(false)
    return null;
  }
  if (id > 0 && id !== 4445) {
    if (checked) {
      await AsyncStorage.setItem('tokenx', data.tokenx);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
      data.bayiid ? await AsyncStorage.setItem('bayiid',data.bayiid): null;
      //await AsyncStorage.setItem('kullanici',)
      console.log('BENİ HATIRLA DENDİ VE LOKAL STRG"E KAYDEDİLDİİİİİİİİİİ');
    }
    await AsyncStorage.setItem('uid', data.id);
    userStore.setUser(data);
    userStore.setTokenx(data.tokenx);
    userStore.setID(data.id)
    let uid = await AsyncStorage.getItem('uid');
    await getSellerInfo();
    await getDailyTotalDistance();
    await getSummaryofCarsStatus();
    await getAlarmsDetail();
    console.log('tokenservice1');
    await getCarList();
    console.log('tokenservice2');
    await oneSignalSetId();
    console.log('tokenservice3');
    //OneSignal External User ID atandı.
    await getDeviceState();
    console.log('tokenservice4');
    //OneSignal'den alınan player id ile app id veritabanında istenen formata getirildi.
    setTimeout(() =>{sendM_TOKEN()},2000); 
    console.log('tokenservice5');
    //Uygulama tekrar açıldığında, M_TOKEN hazır olduktan sonra gönderilmesi için 5sn timeout atıldı.
    await getCarToHome();
    userStore.setVisible2(false);
    if ((BAYIBANNED = 1)) {
      //this.props.navigation.navigate('Info');
    } else {
      //this.props.navigation.navigate('Cars');
    }
  } else {
    Alert.alert(
      'Hata',
      'Geçersiz kullanıcı adı  veya şifre!',
      [{text: 'TAMAM'}],
      {cancelable: false},
    );
    await AsyncStorage.removeItem('tokenx');
    await AsyncStorage.removeItem('uid');
    console.log('remove işlemi tamam');
    userStore.setVisible2(false);
  }
};

export async function sendMail(mail) {
  if (mail.trim() == '') {
    alert('Geçerli bir e posta adresi giriniz');
    return false;
  }
  await axios({
    url:
      'http://mobil1035-1.artemobil.net/ajax/sifremi_unuttum.php?eposta=' +
      mail,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Basic YnJva2VyOmJyb2tlcl8xMjM=',
    },
  }).then(
    function (response) {
      if (response.data.tokenx == '4445') {
        alert('Mail gönderilemedi');
      }
      console.log('====================================');
      console.log(response.data);
      console.log('====================================');
    },
  );
}
