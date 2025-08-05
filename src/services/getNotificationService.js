
import userStore from "../store/userStore";
import { Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getNotifications() {
    var formData = new FormData();
    formData.append('tokenx', userStore.ID);
    userStore.setNotificationIndicator(true);
    console.log(formData);
    //formData.append('version', 'v2');
    await axios({
      url: 'http://mobil1035-1.artemobil.net/mobilservice/v2api/get_notification.php',
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
            userStore.setNotifications(response.data.notification);
            console.log('Notif res2>',userStore.notifications);
            userStore.setNotificationIndicator(false);
        },
      )
      .catch(function (error) {
        userStore.setNotificationIndicator(false);
        Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  }

  