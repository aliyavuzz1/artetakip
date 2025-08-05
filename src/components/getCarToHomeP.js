import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native";
import { navigationRef } from "../navigation/navigationRef";
import { getCarList } from "../services/carListService";
import { getNotifications } from "../services/getNotificationService";
import { getActivationList, getCompanyInfo } from "../services/getProfileService";
import { getSellerInfo } from "../services/getSellerService";
import { getAllCarsMap } from "../services/mapService";
import { getCampaigne } from "../services/oneSignal/notificationService";
import userStore from "../store/userStore";

export async function getCarToHome() {
    console.log('getcar1');
    await getCarList();
    await getCarList('hareketli');
    await getCarList('duran');
    await getCarList('pasif');
    await getCarList('rolanti');
    console.log('getcar2');
    await getSellerInfo()
    .then(
        function () {
            navigationRef.navigate('DrawerRoot',{screen:'SummaryPage'});
        }
        
        )
        .catch((e)=>
            Alert.alert('Hata','Giriş yaparken bir hata oluştu.',[{text:'Tamam',}])
            );
};
export async function getCarToMap() {
    await getAllCarsMap();
    navigationRef.navigate('DrawerRoot',{screen:'AllCarsMap'});
};

export async function getProfileScreen() {
    await getActivationList();
    await getCompanyInfo();
    console.log('gettim');
    let username = await AsyncStorage.getItem('kullanici');
    userStore.setUserName(username);
    navigationRef.navigate('ProfileScreen');
};


export async function getNotificationScreen() {
console.log("Bildirim butonuna basıldı");
    getNotifications();
    navigationRef.navigate('NotificationScreen');
};

export async function getCampaignsScreen() {
    await getCampaigne();
    navigationRef.navigate('CampaignsScreen');
};