
import React, {Component, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getCarList} from '../services/carListService';
import {getPlakaService} from '../services/getPlakaService';
import {BackHandler} from 'react-native';
import { getCampaigne, getNotifInfo, sendM_TOKEN } from '../services/oneSignal/notificationService';
import { getDeviceState } from '../services/oneSignal/getDeviceState';
import { oneSignalSetId } from '../services/oneSignal/setExternalUID';
import { Button, Header ,Image,Input,Text} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigationRef } from '../navigation/navigationRef';
import { DrawerActions, useFocusEffect, useRoute } from '@react-navigation/native';
import CarListv3 from '../components/carListv3';
import sellerStore from '../store/sellerStore';
import carListStore from '../store/carListStore';
import PlateComponent from '../components/flatlistPlateComp';
import getCarsMap from '../services/mapService';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
import sellerInfo from '../../assets/sellerUI/sellerInfo';
import CarListv4 from '../components/carListv4';
const HomeScreen = () => {
  const interval  = useRef(null);
  const [refreshing,setRefreshing] = useState(false)

  //Modal  & Searching states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPlate, setSelectedPlate] = useState(null);

  const [result, setResult] = useState([]);
  const [flatliftRefresh, setFlatlistRefresh] = useState(true);
  const [textInputValue, setTextInputValue] = useState();
  const [groupCarsData , setGroupCarsData] = useState(carListStore.car);
  const [selectedButton, setSelectedButton] = useState('tümü');
  
  const renderItem = ({item}) => {
    const backgroundColor = item.ID === selectedId ? '#8EC3B0' : '#DEF5E5';
    const color = item.ID === selectedId ? 'white' : 'black';
    let color2;
    if (item.ST == 'black') {
        color2 = '#333333'
    } else if (item.ST == 'danger'){
        color2 = '#CC3636'
    }else if (item.ST == 'warning'){
        color2 = '#FFD372'
    }else {
        color2 = '#3CCF4E'
    };
    return (
      <PlateComponent data={item}  color={color2} onPress={async () => {
        //console.log(id);
        setModalVisible(!modalVisible);
        await getCarsMap(item.ID);
        carListStore.setCarReplayID(item.ID);
        navigationRef.navigate('CarsMap1',{cameFrom:'HomeScreen'});
    }} />
    );
  };
  const renderCars = ({item,index}) => {

    let color2;
    if (item.ST == 'black') {
        color2 = '#333333'
    } else if (item.ST == 'danger'){
        color2 = '#CC3636'
    }else if (item.ST == 'warning'){
        color2 = '#FFD372'
    }else {
        color2 = '#3CCF4E'
    };
    return (
      <CarListv4 data={item} index={index}  color={color2} onPress={async () => {
        //console.log(id);
        setModalVisible(!modalVisible);
        await getCarsMap(item.ID);
        carListStore.setCarReplayID(item.ID);
        navigationRef.navigate('CarsMap1',{
          params:{
            cameFrom:"HomeScreen",
            LT:item.LT,
            ST:item.LG,
          }
        });
    }} />
    );
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  function refreshFunc() {
    setRefreshing(true);
    getCarList().then(
      delay(2000).then(() => setRefreshing(false)),
    );
    delay(5000);
  }
  let refreshFuncProp = refreshFunc.bind(this);

  const startCarInterval = () => {
    interval.current = setInterval(function () {
        changeCarArr(selectedButton);
    }, 8000);
  };
  const clearCarInterval = () => {
    clearInterval(interval.current);
    interval.current = null;
  };
  let emptyVariable;
  function find(text) {
    const textUpperCase = text.toUpperCase()
    emptyVariable = carListStore.car.filter(function (entry){
        console.log(entry.P);
        try {
          return entry.P.startsWith(textUpperCase);
        } catch (error) {
          console.log(error);
        }
          
    });;
  setResult(emptyVariable);
  console.log(emptyVariable);
  }

  function handleBackButtonClick() {
    try {
        navigationRef.navigate('HomeScreen');
        return true;
    }
    catch (e) {

    }
};

const changeCarArr = (carStatus) => {
  console.log('CARSTAT --*--',carStatus);
  switch (carStatus) {
    case 'tümü':
      getCarList()
      setSelectedButton('tümü');
      setGroupCarsData(carListStore.car);
      break;
    case 'hareketli':
      getCarList('hareketli')
      setSelectedButton('hareketli');
      setGroupCarsData(carListStore.greenCars);
      break;
    case 'rolanti':
      getCarList('rolanti')
      setSelectedButton('rolanti');
      setGroupCarsData(carListStore.yellowCars);
      break;
    case 'duran':
      getCarList('duran')
      setSelectedButton('duran');
      setGroupCarsData(carListStore.redCars);
      break;
    case 'pasif':
      getCarList('pasif')
      setSelectedButton('pasif');
      setGroupCarsData(carListStore.blackCars);
      break;
    default:
      getCarList()
      setSelectedButton('tümü');
      setGroupCarsData(carListStore.car);
      break;
  }
  console.log('FLATLİST DATYAASI=>',groupCarsData);
}

// COMPONENT DID MOUNT
  useEffect(()=>{
    setResult(carListStore.car)
    getNotifInfo();                        //Kullanıcı bildirimlerinin açık-kapalı durumu sorgulandı.
  },[])
  useFocusEffect(
    React.useCallback(() => {
      startCarInterval()
      BackHandler.addEventListener("hardwareBackPress",handleBackButtonClick);
      return () => {
        clearCarInterval();
        BackHandler.removeEventListener("hardwareBackPress",handleBackButtonClick);
      };
    }, []),
  );

  useEffect(()=>{
    clearCarInterval();
    setTimeout(()=>{startCarInterval()},100);
  },[selectedButton])
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#FAF8F1'}}>
          <Header
            backgroundColor={sellerUI.color3}
            leftComponent={
              <View style={styles.headerRight}>
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    navigationRef.dispatch(DrawerActions.openDrawer());
                  }}>
                  <Ionicons name="menu" color={sellerUI.color4} size={26} />
                </Pressable>
              </View>
            }
            centerComponent={
              <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text h4 h4Style={{fontSize:21, alignSelf:'center', fontWeight:'700',marginTop:3, color:sellerUI.color4}}numberOfLines={1} >{sellerInfo.companyName}</Text>
              </View>
            }
            rightComponent={
              <TouchableOpacity onPress={()=>{setModalVisible(!modalVisible) }}>
                <Ionicons name='search' color={sellerUI.color4} size={25} />
              </TouchableOpacity>
            }
          />
          <View style={{padding:1,marginTop:2}} >
            <View style={{flexDirection:'row',margin:2,justifyContent:'space-evenly'}} >
              <Pressable style={[selectedButton == 'tümü' ? [styles.selectedButton,{backgroundColor:'#009EFF'}] : styles.outlinedButton,{marginRight:2}]} onPress={()=>{setSelectedButton('tümü'); changeCarArr('tümü')}}>
                <Text allowFontScaling={false} style={{textAlign:'center',fontSize:13.5,color:'#ffffff'}} >{i18n.t('all')}</Text>
              </Pressable>
              <Pressable style={[selectedButton == 'hareketli' ? [styles.selectedButton,{backgroundColor:'green'}] : styles.outlinedButton,{marginHorizontal:2}]} onPress={()=>{setSelectedButton('hareketli'); changeCarArr('hareketli')}}>
                <Text allowFontScaling={false} style={{textAlign:'center',fontSize:13.5,color:'#ffffff'}} >{i18n.t('moving')}</Text>
              </Pressable>
              <Pressable style={[selectedButton == 'duran' ? [styles.selectedButton,{backgroundColor:'red'}] : styles.outlinedButton,{marginRight:2}]} onPress={()=>{setSelectedButton('duran'); changeCarArr('duran')}}>
                <Text allowFontScaling={false} style={{textAlign:'center',fontSize:13.5,color:'#ffffff',maxWidth:'110%'}} >{i18n.t('standing')}</Text>
              </Pressable>
              <Pressable style={[selectedButton == 'rolanti' ? [styles.selectedButton,{backgroundColor:'#FFB26B'}] : styles.outlinedButton,{marginRight:2}]} onPress={()=>{setSelectedButton('rolanti'); changeCarArr('rolanti')}}>
                <Text allowFontScaling={false} style={{textAlign:'center',fontSize:13.5,color:'#ffffff'}} >{i18n.t('idling')}</Text>
              </Pressable>
              <Pressable style={[selectedButton == 'pasif' ? [styles.selectedButton,{backgroundColor:'black'}] : styles.outlinedButton,{marginRight:2}]} onPress={()=>{setSelectedButton('pasif'); changeCarArr('pasif')}}>
                <Text allowFontScaling={false} style={{textAlign:'center',fontSize:13.5,color:'#ffffff'}} >{i18n.t('passive')}</Text>
              </Pressable>
            </View>
          </View>
          <View style={{height:'100%'}} >
            <FlatList
              data={groupCarsData}
              renderItem={renderCars}
              refreshControl={refreshing}
              initialNumToRender={7}
              keyExtractor={(item, index) => String(index)}
              style={{marginBottom:140}}
              extraData={groupCarsData}
            />
          </View>
        </View>
        <Modal
        style={{flex:1}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableOpacity style={{flex:1}} onPress={()=>{setModalVisible(!modalVisible)}} >
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Input
                  placeholder='Ara'
                  inputContainerStyle={{borderWidth:1,borderTopLeftRadius:15, borderTopRightRadius:15,backgroundColor:'#6B728E'}}
                  value={textInputValue}
                  style={{backgroundColor:'#fff',borderRadius:10,width:'85%',margin:5, padding:5,height:40}}
                  onChangeText={(text) => find(text)}
                  rightIcon={
                      <Ionicons
                        name='search'
                        size={24}
                        color='black'
                      />
                    }
                  />
                <View style={{padding:4 ,width: '100%',marginTop:-15}}>
                  <FlatList
                    data={result}
                    renderItem={renderItem}
                    initialNumToRender={7}
                    keyExtractor={(item, index) => String(index)}
                    style={{marginBottom:'16%'}}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
      </>
    );
  }


export default HomeScreen;

const styles = StyleSheet.create({
  datePicker: {
    borderWidth: 0.6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent:'flex-end'
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf:'flex-end',
    height: '60%',
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
  selectedButton: {
    backgroundColor:'#579BB1',
    flex:1,
    margin:0,
    borderRadius:3,
    padding:6,
    textAlign:'center',
    justifyContent:'center'
  },
  outlinedButton: {
    backgroundColor:'gray',
    flex:1,
    margin:0,
    padding:6,
    borderRadius:3,
    textAlign:'center',
    justifyContent:'center'
  }
});
