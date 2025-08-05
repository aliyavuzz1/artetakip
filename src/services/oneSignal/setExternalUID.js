import userStore from '../../store/userStore';
import  {OneSignal}  from 'react-native-onesignal';

export const oneSignalSetId = () => {
  console.log('414141414141'); 
  const externalUserId = userStore.ID; // Veritabanındaki benzersiz kullanıcı ID'sini alıyoruz.

  if (!externalUserId) {
    console.error('OneSignal.login başarısız: Kullanıcı ID null veya undefined.');
    return; // Eğer ID boşsa işlem yapılmaz.
  }

  console.log('setExternalUID:', externalUserId); // Kullanıcı ID'sini logluyoruz.

 
  OneSignal.login(externalUserId, (results) => {
    console.log('Results of setting external user id:', results); // İşlem sonuçlarını logla.

    // Push bildirim durumu kontrolü
    if (results.push && results.push.success) {
      console.log('Push notification ID başarıyla ayarlandı:', results.push.success);
    }

    // Email durumu kontrolü (eğer email entegrasyonu aktifse)
    if (results.email && results.email.success) {
      console.log('Email başarıyla ayarlandı:', results.email.success);
    }

    // SMS durumu kontrolü (eğer SMS entegrasyonu aktifse)
    if (results.sms && results.sms.success) {
      console.log('SMS başarıyla ayarlandı:', results.sms.success);
    }

    console.log('====================================');
    console.log('OneSignal external user ID ayarlandı.');
    console.log('====================================');
  });
};
