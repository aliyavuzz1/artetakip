  import OneSignal from 'react-native-onesignal';
  import userStore from '../../store/userStore';
  
  export async function getDeviceState(params) {
    console.log('getDeviceState geliyor');
    
    try {
      // OneSignal'den cihaz durumunu al
      //const deviceState = await OneSignal.getDeviceState();
      console.log('getDeviceState1 geliyor');
      let pushId = await OneSignal.User.pushSubscription.getIdAsync();

      // M_TOKEN değerini userStore'a kaydet
      userStore.setM_TOKEN(pushId + '#' + '4e00d66e-9d48-4c7e-9dbc-cd78239bbfa0');
  
      console.log('60606060606060606060606');
      console.log(pushId, 'DEVICE STATE GELDİ');
      console.log('M_TOKEN ---__---___-->', userStore.M_TOKEN);
    } catch (error) {
      // Hata varsa logla
      //console.error('getDeviceState hatası:', error);
    }
  }
  