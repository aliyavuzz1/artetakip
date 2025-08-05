
import userStore from "../store/userStore";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export async function newPasswordService(oldPass, password) {
    const bayiid = await AsyncStorage.getItem('bayiid');
    var formData = new FormData();
    formData.append('tokenx', userStore.ID);
    formData.append('bayiid', bayiid);
    formData.append('username', userStore.ID);
    formData.append('formd', 'oldpassword=' + oldPass + '&password=' + password);
    console.log(formData);
    await axios({
      url: 'http://mobil1035-1.artemobil.net/mobilservice/ajax.php?act=updatePassword',
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
            console.log(response.data);
            userStore.setResponseMessage(response.data.response);
            userStore.setShowMessageBox(true);
            if (response.data.result == 1) {
                userStore.setPasswordChangeResult(1);
            }
            else {
                userStore.setPasswordChangeResult(0);
            }
        },
      )
      .catch(function (error) {
        Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  }