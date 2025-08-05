
import userStore from "../store/userStore";
import { Alert } from "react-native";
import axios from "axios";
import sellerStore from "../store/sellerStore";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getSellerInfo() {
    var formData = new FormData();
    let tokenxIfRemember = await AsyncStorage.getItem('tokenx');
    let bayiidIfRemember = await AsyncStorage.getItem('bayiid');
    let tokenx = tokenxIfRemember ? tokenxIfRemember : userStore.user.tokenx;
    let bayiid = bayiidIfRemember ? bayiidIfRemember : userStore.user.bayiid;
    formData.append('tokenx', tokenx );
    formData.append('version', 'v2');
    formData.append('bayiid', bayiid);
    formData.append('lang',userStore.choosenLanguage);
    await axios({
      url: 'http://m1.aragis.com/mobilservice/ajax.php?act=getSellerInfo',
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
            console.log('SELLER INFO =>', response.data);
            if (typeof(response.data) == "object" && response.data[0]) {
              sellerStore.setSellerInfo(response.data[0]);
            } else {
              sellerStore.setSellerInfo({"0": {"address": "Adress", "bayi_id": "xxxx", color_1: "#000000", color_2: "#ffffff", color_3: "#df0000", color_4: "#ffffff", "company_name": "company_name", "company_website": "https://website.com/", "fax": null, "id": "1", "mail_address": "mail@mail.com", "phone_gsm": "05123456789", "phone_land": "05123456789", "phone_whatsapp": "05123456789", "url": "https://n2mobil.com.tr/userfiles/i/2175/arac_takip_sistemi_detaylari_nelerdir.jpg"}, "address": ""}
              )
            }
        },
      )
      .catch(function (error) {
        Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edip tekrar deneyin!', [{text: 'TAMAM'}], {cancelable: false})
      });
  }
