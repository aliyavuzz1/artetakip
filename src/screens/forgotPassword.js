import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Button} from 'react-native-elements';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import {i18n} from '../localization';
import {navigationRef} from '../navigation/navigationRef';
import {sendMail} from '../services/tokenService';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      visible: false,
      visible2: true,
      eye: false,
    };
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{flexGrow: 1, backgroundColor: 'white'}}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={{marginTop: '5%'}}>
              <View
                style={{
                  width: '60%',
                  height: 200, // Daha düzgün oran için sabit bir yükseklik verdik
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30, // Biraz aşağıya al
                }}>
                <Image
                  source={require('../../assets/sellerUI/sellerIcons/arte.png')}
                  resizeMethod="scale"
                  resizeMode="contain"
                  style={styles.logo}
                />
              </View>
            </View>
            <Text style={styles.label}>
              {i18n.t('E-posta adresinizi girin')}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                autoCapitalize="none"
                style={styles.inputs}
                placeholder={i18n.t('email')}
                placeholderTextColor={'gray'}
                onChangeText={username => this.setState({username: username})}
              />
              <IonicIcons
                name="mail"
                size={24}
                color="black"
                style={styles.icon}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigationRef.navigate('Login');
                }}
                style={styles.backButton}>
                <IonicIcons
                  name="chevron-back-outline"
                  size={26}
                  color="black"
                />
                <Text style={styles.backButtonText}>{i18n.t('login')}</Text>
              </TouchableOpacity>
              <Button
                buttonStyle={styles.button}
                title={i18n.t('send')}
                onPress={() => {
                  sendMail(this.state.username);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 80,
  },
  title: {
    marginTop: '10%',
    marginLeft: '4%',
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
  logoContainer: {
    aspectRatio: 1,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '150%',
    height: '150%',
  },
  label: {
    marginLeft: 15,
    color: 'black',
    marginTop: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    width: '80%',
    borderRadius: 10,
    marginLeft: 15,
    color: 'black',
    height: 45,
    paddingLeft: 10,
  },
  icon: {
    marginLeft: 7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: "#df0000",
    maxWidth: 120,
    alignSelf: 'center',
  },
});
