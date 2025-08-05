import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ScrollView
} from 'react-native';
import { Avatar, Button, Card, Header, Switch, Text } from 'react-native-elements';
import { navigationRef } from '../navigation/navigationRef';
import Icon from 'react-native-vector-icons/Ionicons';
import { observer } from 'mobx-react';
import sellerStore from '../store/sellerStore';
import { DrawerActions } from '@react-navigation/native';
import userStore from '../store/userStore';
import carListStore from '../store/carListStore';
import { Item } from '../components/listItem';
import { getCompanyInfo } from '../services/getProfileService';
import { Line, Line2 } from '../components/lineComponent';
import { switchNotif } from '../services/oneSignal/notificationService';
import AnimatedLottieView from 'lottie-react-native';
import { getCarToMap } from '../components/getCarToHomeP';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
const ProfileScreen = observer(() => {


  //Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);

  const toggleSwitch = () => {
    switchNotif();
    userStore.setUserNotifStatus(!userStore.userNotifStatus)
    console.log('TOOGGLEEEE');
  };


  const renderItem = ({ item }) => {
    const backgroundColor = item.ID === selectedId ? '#8EC3B0' : '#DEF5E5';
    const color = item.ID === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.ID);
          setSelectedPlate(item.P);
          setModalVisible(!modalVisible);
          console.log(selectedId);
        }}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View>
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigationRef.dispatch(DrawerActions.openDrawer());
              }}>
              <Icon name="menu" color={sellerUI.color2} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text h4 h4Style={{ fontSize: 18, alignSelf: 'center', fontWeight: 'bold', marginTop: 3, color: sellerUI.color2 }} >{ i18n.t('profile')}</Text>
          </View>
        }
      />
      <ScrollView style={{ marginBottom: 10 }} scrollIndicatorInsets={{ right: 1 }} >
        <View style={{ paddingVertical: 20, backgroundColor: '#ffffff' }}>
          <View style={{ padding: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff' }} >
            <Avatar
              imageProps={{
                resizeMethod: 'scale',
                resizeMode: 'contain',
                source: require('../../assets/img/avatarIcon.png')
              }}
              size='medium'
            />
            <View style={{ padding: 10, marginLeft: 5, flex: 2 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userStore.userName}</Text>
              <Text style={{ fontWeight: '300', fontSize: 15,color:'gray' }}>{userStore.ID}</Text>
            </View>
            {console.log(userStore.companyInfo)}
            <View style={{ alignSelf: 'flex-end', flex: 1 }} >
              <TouchableOpacity
                style={{ justifyContent: 'space-evenly', alignItems: 'center', marginHorizontal: 10 }}
                onPress={() => {
                  toggleSwitch();
                }}>
                <Text style={{ fontSize: 14, textAlign: 'center', color: 'black', fontWeight: '500',width:'120%' }}>
                  { i18n.t('notification')}
                </Text>
                <View>
                <Switch
                  trackColor={{ false: '#fff', true: 'green' }}
                  thumbColor={userStore.userNotifStatus ? '#3e3e3e' : 'red'}
                  style={{ transform: [{ scaleX: 1 }, { scaleY: .9 }] }}
                  onValueChange={toggleSwitch}
                  ios_backgroundColor="#3e3e3e"
                  value={userStore.userNotifStatus}
                />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', paddingBottom: 20, width: '100%',justifyContent:'flex-end' }} >
            <Button title={ i18n.t('changePassword')} titleStyle={{ fontSize: 14, color: '#4170E9' }} buttonStyle={{ backgroundColor: '#D5DEFF', padding: 10,marginRight:'10%' }} onPress={() => { navigationRef.navigate('ChangePassword') }}></Button>
          </View>
        </View>
        <View style={{ backgroundColor: '#efefef', borderWidth: 0.4, padding: 6, }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }} >
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginRight: 5 }} >{ i18n.t('businessInformation')}</Text>
            <Icon name='document' size={23} color='#000' />
          </View>
          {
            userStore.companyInfo[0]
              ?
              <View>
                <Line2 data={userStore.companyInfo[0].COMPANY} title={ i18n.t('company')} />
                <Line2 data={userStore.companyInfo[0].C_ADRES} title={ i18n.t('address')}  />
                <Line2 data={userStore.companyInfo[0].C_EPOSTA} title={ i18n.t('email')}  />
                <Line2 data={userStore.companyInfo[0].C_ILGILI} title={ i18n.t('related')}  />
                <Line2 data={userStore.companyInfo[0].C_ILGILICEP} title={ i18n.t('relatedPhone')}  />
              </View>
              :
              <View></View>
          }


          {/*
            userStore.companyInfo.map((data,i)=>{
              console.log('DATAMIZ BU',data)
              return(
                <View
                  key={i}
                  style={styles.item}>
                  <Text
                    style={{fontSize: 15,fontWeight:'700', flex:2, textAlign: 'left'}}>
                    {}
                  </Text>
                  <Text style={{flex:1,textAlign:'center'}}>Mesut Otomotiv</Text>
                </View>
              )
            })
          */}
        </View>
        <View style={{ backgroundColor: '#efefef', borderWidth: 0.4, padding: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginRight: 5 }} >{ i18n.t('activationTimes')} </Text>
            <Icon name='timer' size={26} color='#000' />
          </View>
          <View style={{ width: '90%', alignSelf: 'center', borderTopWidth: 0.7, marginBottom: 6, marginTop: 2 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginLeft: 5 }} >
            <Text style={{ flex: 2, fontWeight: '600' }}>{ i18n.t('plate')} </Text>
            <Text style={{ flex: 1, fontWeight: '600' }} >{ i18n.t('startDate')} </Text>
            <Text style={{ flex: 1, fontWeight: '600' }} >{ i18n.t('endDate')} </Text>
          </View>
          {
            userStore.activationTimeList.map((data, i) => {
              return <Line key={i} data={data} />
            })
          }
        </View>
      </ScrollView>
      <Modal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => { setModalVisible(!modalVisible) }} >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={{ width: '100%', }}>
                  <Text style={{ fontSize: 20, fontWeight: '600', margin: 5 }}>
                    Plakalar
                  </Text>
                  <FlatList
                    style={{ width: '100%', marginBottom: 26 }}
                    data={carListStore.plate}
                    renderItem={renderItem}
                    keyExtractor={item => item.ID}
                    extraData={selectedId}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#F4F5FB',
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'justify',
    margin: 2,
  },
  addressText: {
    maxWidth: '90%',
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
  },
  image: {
    aspectRatio: 1 * 1,
    height: 50
  },
  cardContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 3
  },
  cardTitle: {
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  seperatorHorizontal: {
    width: '70%',
    borderBottomWidth: 1,
    alignSelf: 'center',
    marginBottom: 5
  },
  seperatorVertical: {
    height: '90%',
    alignSelf: 'flex-start',
    borderLeftWidth: 1.2,
    borderRadius: 10,
    margin: 3
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignSelf: 'flex-end',
    height: '70%',
    width: '100%',
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
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  item: {
    margin: 2,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth: 0.2,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});
