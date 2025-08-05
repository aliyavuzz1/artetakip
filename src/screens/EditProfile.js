import React, { useEffect, useRef , useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import {Button, Header, Text} from 'react-native-elements';
import {navigationRef} from '../navigation/navigationRef';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {observer} from 'mobx-react';
import sellerStore from '../store/sellerStore';
import { newPasswordService } from '../services/changePasswordService';
import userStore from '../store/userStore';
import sellerUI from '../../assets/sellerUI/sellerUI';
const EditProfile = observer(() => {

    const checkPasswords = () =>{
        if (password == passwordAgain) {
            newPasswordService(oldPass,password);
        }
        else {
            Alert.alert('','Girdiğiniz şifreler uyuşmuyor.')
        }
    }
    const [oldPass, setOldPass] = useState();
    const [password, setPassword] = useState();
    const [passwordAgain, setPasswordAgain] = useState();

    return (
    <View style={styles.container}>
        <Header
            backgroundColor={sellerUI.color3}
            leftComponent={
            <View>
                <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                    navigationRef.goBack();
                }}>
                <Icon name="return-up-back" color={'black'} size={26} />
                </TouchableOpacity>
            </View>
            }
            centerComponent={
                <View style={{alignItems:'center', justifyContent:'center'}}>
                    <Text h4 h4Style={{fontSize:18, alignSelf:'center', fontWeight:'bold',marginTop:3, color:'black'}} >Profili Düzenle</Text>
                </View>
            }
        />
        <View style= {{
            backgroundColor: userStore.passwordChangeResult == 0 ?'#F5D5AE':'#B2D5AE', 
            padding:10,
            flexDirection:'row',
            margin:10,
            borderRadius:4,
            justifyContent:'center', 
            marginTop:20,
            marginBottom:-10,
            display:userStore.showMessageBox ? 'flex' : 'none'
            }}>
            <Text style= {{fontWeight:'bold'}}>{userStore.passwordChangeResult == 0 ? 'Hata.' : 'Başarılı.'} {userStore.responseMessage} </Text>
        </View>
        <View style={{flexDirection:'row',marginLeft:10,marginTop:20}} >
                <Text style={{fontSize:15,  color:'#000000', fontWeight:'700',fontStyle:'italic',}} >Eski Şifreniz</Text>
                <Text style={{fontSize:15, color:'red', fontWeight:'700',fontStyle:'italic'}}>(*)</Text>
        </View>
        <TextInput
            autoCapitalize="none"
            style={styles.inputs}
            secureTextEntry={true}
            placeholderTextColor={'#000'}
            onChangeText={oldPass =>
                setOldPass(oldPass)
            }
            />
            <View style={{flexDirection:'row',marginLeft:10,marginTop:10}} >
                <Text style={{fontSize:15,  color:'#000000', fontWeight:'700',fontStyle:'italic',}} >Yeni Şifreniz</Text>
                <Text style={{fontSize:15, color:'red', fontWeight:'700',fontStyle:'italic'}}>(*)</Text>
            </View>
        <TextInput
            autoCapitalize="none"
            style={styles.inputs}
            secureTextEntry={true}
            placeholder=""
            placeholderTextColor={'#000'}
            onChangeText={password =>
                setPassword(password)
            }
            />
        <View style={{flexDirection:'row',marginLeft:10,marginTop:10}} >
            <Text style={{fontSize:15,  color:'#000000', fontWeight:'700',fontStyle:'italic',}} >Yeni Şifreniz Tekrar</Text>
            <Text style={{fontSize:15, color:'red', fontWeight:'700',fontStyle:'italic'}}>(*)</Text>
        </View>
        <TextInput
            autoCapitalize="none"
            style={styles.inputs}
            secureTextEntry={true}
            placeholderTextColor={'#000'}
            onChangeText={passwordAgain =>
                setPasswordAgain(passwordAgain)
            }
            />
        <Button title={'Kaydet'} containerStyle={{margin:10}} onPress={()=>{checkPasswords()}} />
    </View>
    );
    });
export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:'100%',
    width:'100%',
    backgroundColor: '#F4F5FB',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'justify',
    margin: 2,
  },
  inputs: {
    borderWidth: 1,
    borderColor: 'black',
    margin: 5,
    padding:10,
    width: '90%',
    borderRadius: 10,
    marginLeft: 15,
    height:45,
    color:'black',
  },
});
