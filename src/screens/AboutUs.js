import React, { useEffect, useRef , useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import {Button, Header, Text} from 'react-native-elements';
import {navigationRef} from '../navigation/navigationRef';
import Icon from 'react-native-vector-icons/Ionicons';
import {observer} from 'mobx-react';
import sellerStore from '../store/sellerStore';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getSellerInfo } from '../services/getSellerService';
import { i18n } from '../localization';
import sellerInfo from '../../assets/sellerUI/sellerInfo';
import sellerUI from '../../assets/sellerUI/sellerUI';
const AboutUs = observer(() => {
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigationRef.navigate('HomeScreen');
              }}>
              <Icon name="return-up-back" color={sellerUI.color2} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
            <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text h4 h4Style={{fontSize:18, alignSelf:'center', fontWeight:'bold',marginTop:3, color:sellerUI.color2}} >{i18n.t('aboutUs')}</Text>
            </View>
        }
      />
        <View>
            <Image
                resizeMethod='scale'
                resizeMode='contain'
                source={require('../../assets/sellerUI/sellerIcons/arte.png')}
                style={{width:'90%',maxHeight:'40%',aspectRatio:1*1,alignSelf:'center'}}>
            </Image>
            <View style={[styles.cardContainer,{marginTop:8}]} >
              <Text style={styles.cardTitle} >{i18n.t('address')}</Text>
              <View style={styles.seperatorHorizontal}/>
              <View style={{flexDirection:'row'}} >
                  <Entypo name='address' color={'black'} size={22} style={{alignSelf:'center',margin:5}} />
                  <View style={styles.seperatorVertical} />
                  <Text style={styles.addressText} >{sellerInfo.address}</Text>
              </View>
            </View>
            <View style={styles.cardContainer} >
              <Text style={styles.cardTitle} >{i18n.t('email')}</Text>
              <View style={styles.seperatorHorizontal}/>
              <View style={{flexDirection:'row'}} >
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{Linking.openURL(`mailto:${sellerInfo.mail_address}?subject=Araç Takip --Destek`)}} >
                  <Entypo name='email' color={'black'} size={22} style={{alignSelf:'center',margin:5}} />
                  <View style={styles.seperatorVertical} />
                  <Text style={styles.addressText} >{sellerInfo.mail_address }</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardContainer} >
              <Text style={styles.cardTitle} >{i18n.t('phone')}</Text>
              <View style={styles.seperatorHorizontal}/>
              <View style={{flexDirection:'row'}} >
                <TouchableOpacity disabled={sellerInfo.phone_gsm ? false : true} style={{flexDirection:'row'}} onPress={()=>{Linking.openURL(`tel:${sellerInfo.phone_gsm}`)}} >
                  <Entypo name='phone' color={'black'} size={22} style={{alignSelf:'center',margin:5}} />
                  <View style={styles.seperatorVertical} />
                  <Text style={[styles.addressText,{marginLeft:10}]} >{sellerInfo.phone_gsm }</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={sellerInfo.phone_gsm ? false : true} style={{flexDirection:'row'}} onPress={()=>{Linking.openURL(`https://wa.me/905343663505`)}} >
                  <FontAwesome name='whatsapp' color={'black'} size={24} style={{alignSelf:'flex-end',margin:5, marginLeft:'10%'}} />
                  <View style={styles.seperatorVertical} />
                  <Text style={[styles.addressText,{marginLeft:10}]} >{sellerInfo.phone_whatsapp}</Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
    </View>
  );
});
export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F1',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'justify',
    margin: 2,
  },
  addressText : {
    maxWidth:'90%',
    fontSize:14,
    alignSelf:'center',
    textAlign:'center',
  },
  cardContainer : {
    padding:10,
    borderWidth:1, 
    borderRadius:10, 
    backgroundColor:'#fff',
    marginVertical:3
  },
  cardTitle: {
    alignSelf:'center',
    fontWeight:'bold'
  },
  seperatorHorizontal: {
    width:'70%',
    borderBottomWidth:1,
    alignSelf:'center',
    marginBottom:5
  },
  seperatorVertical: {
    height:'90%', 
    alignSelf:'flex-start',
    borderLeftWidth:1.2,
    borderRadius:10, 
    margin:3
  }
});
//onPress={()=>{Linking.openURL(`https://wa.me/905323654496`)}}