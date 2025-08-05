/*function vehicleInfo() {
    $.post(getDefine("baseURL") + "/mobilservice/v2api/get_vehicle_info.php", { tokenx: tokenx.tokenx, plaka: plaka, version: "v2" })
        .then(function (response) {
            let data = JSON.parse(response);
            let storage = window.localStorage;
            let lng = storage.getItem("lang");
            if (lng == "tr")
                alert("Başlangıç Tarihi:" + data.start_date + "<br>Bitiş Tarihi:" + data.end_date)
            else
                alert("Start Date:" + data.start_date + "<br>End Date:" + data.end_date)
        })
}
*/

import axios from "axios";
import { Alert } from "react-native";
import userStore from "../store/userStore";

export async function getActivationTime(deviceID) {
    let tokenx = userStore.tokenx;
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('plaka',deviceID);
    console.log(formData);
    await axios({
      url:'http://mobil1035-1.artemobil.net/mobilservice/v2api/get_vehicle_info.php',
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
          console.log('Cihaz Aktivasyon süresi :', data);
        },
      )
      .catch(function (error) {
        Alert.alert('Hata:', error, [{text: 'TAMAM'}], {cancelable: false});
      });
  }
  
  export async function getActivationList() {
    let tokenx = userStore.tokenx;
    const userID = userStore.ID
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('user_id',userID);
    console.log(formData);
    await axios({
      url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=activationList',
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
          userStore.setActivationTimeList(data);
          console.log('Cihaz Aktivasyon süresi :', data);
        },
      )
      .catch(function (error) {
        Alert.alert('Hata:', error, [{text: 'TAMAM'}], {cancelable: false});
      });
  }

  export async function getProfileInfo() {
    const tokenx = userStore.tokenx;
    const userID = userStore.ID
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('user_id',userID);
    console.log(formData);
    await axios({
      url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=activationList',
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
          console.log('Cihaz Aktivasyon süresi set edildi:', data);
        },
      )
      .catch(function (error) {
        Alert.alert('Hata:', error, [{text: 'TAMAM'}], {cancelable: false});
      });
  };


  export async function getCompanyInfo() {
    let tokenx = userStore.tokenx;
    const userID = userStore.ID
    var formData = new FormData();
    formData.append('tokenx', tokenx);
    formData.append('version', 'v2');
    formData.append('user_id',userID);
    console.log(formData);
    await axios({
      url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=companyInfo',
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
          userStore.setCompanyInfo(data);
        },
      )
      .catch(function (error) {
        Alert.alert('Hata:', error, [{text: 'TAMAM'}], {cancelable: false});
      });
  }
  