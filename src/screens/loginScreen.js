import React, {Component, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
  Dimensions,
  Linking,
  TextInput,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button} from 'react-native-elements';
import {getTokenCode} from '../services/tokenService';
import {observer, inject} from 'mobx-react';
import userStore from '../store/userStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {navigationRef} from '../navigation/navigationRef';
import {getCarToHome} from '../components/getCarToHomeP';
import Colors from '../../assets/global/color';
import AnimatedLottieView from 'lottie-react-native';
import {i18n} from '../localization';
import getDailyTotalDistance, {
  getAlarmsDetail,
  getSummaryofCarsStatus,
  getTotalAlarms,
} from '../services/summaryServices';
import {getSellerInfo} from '../services/getSellerService';
import sellerInfo from '../../assets/sellerUI/sellerInfo';
import sellerUI from '../../assets/sellerUI/sellerUI';

/*async function loginSuccess(res) {
  //let tokenx = JSON.parse(res);
  console.log(typeof(res))
  if (tokenx.id > 0) {
    
  console.log('buraya giriyo mu?',tokenx.id)
   //await AsyncStorage.setItem('uid' , tokenx.id)
   //await AsyncStorage.setItem('utokenx', tokenx.tokenx)
   //await AsyncStorage.setItem('bayibanned', tokenx.BAYIBANNED)
   //await AsyncStorage.setItem('mapkey' , tokenx.MAPKEY)
    if (tokenx.BAYIBANNED == 1) {
      //navigation.navigate('InformationScreen')
    }else{
      //navigation.navigate('CarsScreen')
    }
  }else{
    await Alert.alert('Hata', 'Kullanıcı bulunamadı', [{text: 'TAMAM'}], {cancelable: false});
  }

 // let a = await AsyncStorage.getItem('uid');
  //console.log(a)
}*/

@inject('userStore')
@observer
export default class LoginScreen extends Component {
  /* [checked , setChecked] = useState(false);
  [password , setPassword] = useState('');
  [username , setUsername] = useState('');
  [visible , setVisible] = useState(false);
  [visible2 , setVisible2] = useState(false);
  [eye , setEye] = useState(true);
  [task , setTask] = useState(true);
  [remember , setRemember] = useState(false);*/
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      password: '',
      username: '',
      visible: false,
      visible2: false,
      eye: true,
      task: true,
      remember: false,
      choosenLang: 'tr',
      langChange: false,
    };
    this.isAuthValid();
  }
  async componentDidMount() {
    console.log('login didmound');
    i18n.locale ? this.changeLanguage(i18n.locale) : (i18n.locale = 'tr');
    this.setState({langChange: !this.state.langChange});
  }
  changeLanguage(lang) {
    i18n.locale = lang;
    this.setState({choosenLang: lang});
    this.setState({langChange: !this.state.langChange});
    userStore.setChoosenLanguage(lang);
  }
  /*async login(username, password) {
        try{
          const {data} = await getTokenCode(username, password)
          console.log('DATAAAA' , data)
          if(data.error){
           await Alert.alert('Uyarı', 'Kullanıcı bulunamadı', [{text: 'TAMAM'}], {cancelable: false});
            return false;
          }
          await UserStore.setUser()
          console.log('user set edildi');
          await AuthStore.setToken(data.access_token, data.refresh_token, this.state.checked)
          this.setState({visible: false})
          // AuthStore.setToken(data.access_token, data.refresh_token,'10', this.state.checked)
        }catch (e) {
            await Alert.alert('Uyarı', 'kullanıcı bulunamadı', [{text: 'TAMAM'}], {cancelable: false});
        }
      };*/

  async isAuthValid() {
    let isLoggedIn = await AsyncStorage.getItem('tokenx');
    let username = await AsyncStorage.getItem('username');
    let pass = await AsyncStorage.getItem('password');
    console.log('USERNAME AND PASS ', username, pass, isLoggedIn);
    if (isLoggedIn !== null || username !== null) {
      console.log('geldi', username, pass);
      this.setState({username: username});
      this.setState({password: pass});
      this.setState({checked: true});
      console.log(this.state.username, this.state.password);
      /*userStore.setRemember(true);
      userStore.setTokenx(isLoggedIn);
      userStore.setID(userID);
      console.log('USSERIMIN IDSİ',userID);
      i18n.locale = language;
      await getSummaryofCarsStatus();
      getTotalAlarms();
      getDailyTotalDistance();
      getCarToHome();
      getAlarmsDetail();
      await getSellerInfo()
        .then(console.log('seller info'))
        .catch((e)=>{
          console.log(e);
          navigationRef.navigate('Login')
        });*/
    } else {
      userStore.setRemember(false);
      navigationRef.navigate('Login');
    }
    console.log('remember me', this.state.checked);
  }

  render() {
    return (
      <>
        {userStore.remember ? (
          <SafeAreaView style={styles.centeredActivityI}>
            <ActivityIndicator size={56} color="#E99449"></ActivityIndicator>
          </SafeAreaView>
        ) : (
          <ScrollView style={styles.container}
          contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
          keyboardShouldPersistTaps="handled">
            <View style={{marginTop: '5%',backgroundColor:'white'}}>
              <KeyboardAvoidingView>
                <View
                  style={{
                    aspectRatio: 1,
                    width: '80%',
                    alignSelf: 'center',
                    justifyContent: 'center', // Dikey hizalama yaptım
                    alignItems: 'center', // Yatay hizalama yaptım (önemli)
                    marginTop: 10, // Logoyu biraz aşağıya taşıdım çok üstteydi
                  }}>
                  <Image
                    source={require('../../assets/sellerUI/sellerIcons/arte.png')}
                    resizeMethod="scale"
                    resizeMode="contain"
                    style={{width: '90%', height: '90%'}}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <TextInput
                    autoCapitalize="none"
                    style={styles.inputs}
                    placeholderTextColor={'gray'}
                    placeholder={i18n.t('username')}
                    value={this.state.username}
                    onChangeText={username =>
                      this.setState({username: username})
                    }
                  />
                  <FontAwesome
                    name="user"
                    size={24}
                    color="black"
                    style={{marginLeft: 7}}></FontAwesome>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    autoCapitalize="none"
                    style={styles.inputs}
                    placeholder={i18n.t('password')}
                    placeholderTextColor={'gray'}
                    secureTextEntry={this.state.eye}
                    value={this.state.password}
                    onChangeText={password =>
                      this.setState({password: password})
                    }
                  />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({eye: !this.state.eye});
                    }}>
                    {this.state.eye ? (
                      <FontAwesome
                        name="eye-slash"
                        size={22}
                        color="black"
                        style={{marginLeft: 5}}></FontAwesome>
                    ) : (
                      <FontAwesome
                        name="eye"
                        size={22}
                        color="#307191"
                        style={{marginLeft: 5}}></FontAwesome>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{flexDirection: 'row', marginLeft: 10, marginTop: 10}}>
                  <BouncyCheckbox
                    isChecked={true}
                    size={20}
                    fillColor={"#df0000"}
                    onPress={() => {
                      this.setState({checked: !this.state.checked});
                    }}
                  />
                  <Text
                    style={{
                      textAlign: 'center',
                      alignSelf: 'flex-end',
                      color: 'black',
                      fontWeight: '500',
                      marginLeft: -5,
                    }}>
                    {i18n.t('rememberMe')}
                  </Text>
                </View>
                <View
                  style={{flexDirection: 'row', marginLeft: 10, marginTop: 10}}>
                  <View
                    style={{
                      backgroundColor: '#000',
                      height: 20,
                      width: 20,
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FontAwesome size={16} name="info" color={'#fff'} />
                  </View>
                  <Text
                    style={{
                      marginLeft: 2,
                      fontSize: 11,
                      alignSelf: 'center',
                      color: '#000',
                    }}>
                    {i18n.t('infoLogin')}
                  </Text>
                </View>
                <Button
                  buttonStyle={styles.button}
                  title={i18n.t('login')}
                  onPress={() => {
                    console.log(this.state.username, this.state.password);
                    //this.login2(this.state.username , this.state.password);
                    //this.props.navigation.navigate('Home')
                    //navigationRef.navigate('SummaryPage');
                    userStore.setRememberMe(this.state.checked);
                    userStore.setVisible2(true);
                    getTokenCode(
                      this.state.username,
                      this.state.password,
                      this.state.checked,
                    );
                  }}></Button>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 2,
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: '5%',
                  }}>
                  <View style={{marginLeft: '2%'}}>
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          this.state.choosenLang == 'en'
                            ? '#579BB1'
                            : '#948a8a',
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        marginBottom: 2,
                      }}
                      onPress={() => {
                        this.changeLanguage('en');
                      }}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>
                        en
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          this.state.choosenLang == 'tr'
                            ? "#df0000"
                            : "#df0000",
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        marginTop: 2,
                      }}
                      onPress={() => {
                        this.changeLanguage('tr');
                      }}>
                      <Text style={{color: '#fff', fontWeight: 'bold'}}>
                        tr
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={() => {
                      navigationRef.navigate('ForgotPassword');
                    }}>
                    <Text
                      style={{
                        textAlign: 'right',
                        fontSize: 14,
                        color: 'black',
                      }}>
                      {i18n.t('forgotPassword')}
                    </Text>
                    <IonicIcons
                      name="chevron-forward-outline"
                      size={22}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
              {userStore.visible2 ? (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={this.props.visible2}
                  statusBarTranslucent={true}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <ActivityIndicator size="large" color={'red'} />
                      {this.props.task ? (
                        <Text style={styles.modalText}>{this.props.task}</Text>
                      ) : (
                        <Text style={styles.modalText}>
                          {i18n.t('loading')}
                        </Text>
                      )}
                    </View>
                  </View>
                </Modal>
              ) : null}
            </View>
            <View
              style={{
                alignSelf: 'center',
                marginTop: '6%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(
                   `https://wa.me/905343663505`,
                  );
                }}
                style={{marginRight: 12}}>
                <FontAwesome
                  name="whatsapp"
                  size={24}
                  color={'#000'}></FontAwesome>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(sellerInfo.companyWebsite);
                }}
                style={{marginLeft: 12}}>
                <AntDesign name="earth" size={24} color={'#000'}></AntDesign>
              </TouchableOpacity>
              <View></View>
            </View>
          </ScrollView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding: 10,
    width: '80%',
    borderRadius: 10,
    marginLeft: 15,
    height: 45,
    color: 'black',
  },
  logo: {
    height: '100%',
    width: '100%',
  },
  button: {
    backgroundColor: "#df0000",
    width: Dimensions.get('window').width,
    marginTop: 10,
  },
  loginS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    margin: 20,
    width: 200,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 17,
    marginLeft: 15,
  },
  centeredActivityI: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
