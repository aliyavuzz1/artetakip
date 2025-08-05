import React, {useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {Alert} from 'react-native';
import {navigationRef} from '../navigation/navigationRef';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';

let requestTimer = null;

export async function artesetBlockage(id) {
  let tokenx = userStore.tokenx;
  if (requestTimer != null) {
    alert('Bekleyen işleminiz var.');
    return false;
  }
  console.log('====================================');
  console.log('SETBLOKE İD : ', id);
  console.log('====================================');
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('aracid', id);
  carListStore.setMapActI(true);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=bloke',
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
        if (data.requid > 0) {
          alert('Bloke isteği alınmıştır. ');
          requestTimer = setInterval(function () {
            cmdControl(data.requid);
            console.log('====================================');
            console.log('request timer');
            console.log('====================================');
          }, 10000);
        } else {
          alert('Bağlantı Hatası');
          carListStore.setMapActI(false);
        }
      },
    )
    .catch(function (error) {
      alert('Bağlantı hatası' + error);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

async function cmdControl(requid) {
  let tokenx = userStore.tokenx;
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('requid', requid);
  console.log('cmd ye geldi');

  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=responseControl',
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
        console.log('CMD KONTROL RESPONSE response :', data);
        if (response.data.trim() == 'Approved') {
          clearInterval(requestTimer);
          requestTimer = null;
          carListStore.setMapActI(false);
          alert('Komutunuz cihaza iletilmiştir.');
        } else if (response.data.trim() == '-1') {
          clearInterval(requestTimer);
          requestTimer = null;
          carListStore.setMapActI(false);
          alert('Komutunuz cihaza iletilirken bir sorun oluştu.');
        }
      },
    )
    .catch(function (error) {
      alert('Bağlantı Hatası', error);
      clearInterval(requestTimer);
      requestTimer = null;
      carListStore.setMapActI(false);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

export async function arteUnBlockage(id) {
  let tokenx = userStore.tokenx;
  if (requestTimer != null) {
    alert('Bekleyen işleminiz var.');
    return false;
  }
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('aracid', id);
  carListStore.setMapActI(true);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=kaldir',
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
        if (data.requid > 0) {
          alert('Bloke kaldırma isteği alınmıştır. ');
          requestTimer = setInterval(function () {
            cmdControl(data.requid);
            console.log('====================================');
            console.log('request timer');
            console.log('====================================');
          }, 10000);
        } else {
          alert('Bağlantı Hatası');
          carListStore.setMapActI(false);
        }
      },
    )
    .catch(function (error) {
      alert(
        'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyiniz.' +
          error,
      );
      carListStore.setMapActI(false);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}

export async function arteReset(id) {
  let tokenx = userStore.tokenx;
  if (requestTimer != null) {
    alert('Bekleyen işleminiz var.');
    return false;
  }
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('aracid', id);
  carListStore.setMapActI(true);
  await axios({
    url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=reset',
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
        if (data.requid > 0) {
          alert(
            'Resetleme isteği alınmıştır. Kısa süre içerisinde iletim bilgisi gelecektir.',
          );
          requestTimer = setInterval(function () {
            cmdControl(data.requid);
            console.log('====================================');
            console.log('request timer');
            console.log('====================================');
          }, 10000);
        } else {
          alert('Bağlantı Hatası');
          carListStore.setMapActI(false);
        }
      },
    )
    .catch(function (error) {
      alert('İşlem iptal edilmiştir. Tekrar deneyin.');
      carListStore.setMapActI(false);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}


export async function arteInstantLocationRequest(id) {
  let tokenx = userStore.tokenx;
  if (requestTimer != null) {
    alert('Bekleyen işleminiz var.');
    return false;
  }
  var formData = new FormData();
  formData.append('tokenx', tokenx);
  formData.append('version', 'v2');
  formData.append('aracid', id);
  carListStore.setMapActI(true);
  carListStore.setMapActId(id);
  await axios({
    url: 'http://mobil1001-1.artemobil.net/mobilservice/ajax.php?act=anlikkonum',
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
        console.log('response :', data);
        if (data.requid > 0) {
          Alert.alert('', 'Anlık konum isteği alınmıştır.', [{text: 'TAMAM'}], {cancelable: false})
          requestTimer = setInterval(function () {
            cmdControl(data.requid);
            console.log('====================================');
            console.log('request timer');
            console.log('====================================');
          }, 10000);
        } else {
          alert('Bağlantı Hatası');
          carListStore.setMapActI(false);
        }
      },
    )
    .catch(function (error) {
      alert('İşlem iptal edilmiştir. Tekrar deneyin.');
      carListStore.setMapActI(false);
      //Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
    });
}
