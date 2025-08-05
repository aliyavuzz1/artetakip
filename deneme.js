import React, { useEffect, useRef , useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  Animated,
  Pressable,
  Dimensions,
  Share,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Card, Text,Button, Switch, CheckBox} from 'react-native-elements';
import carListStore from '../store/carListStore';
import {Header} from 'react-native-elements';
import MapView, { Marker,PROVIDER_DEFAULT} from 'react-native-maps';
import {navigationRef} from '../navigation/navigationRef';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommutyIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getCarsMap, { changeMarkersIcon } from '../services/mapService';
import {observer} from 'mobx-react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  arteInstantLocationRequest,
  arteReset,
  artesetBlockage,
  arteUnBlockage,
} from '../services/blockageService';
import {ActivityIndicator} from 'react-native-paper';
import {useFocusEffect, useIsFocused, useRoute} from '@react-navigation/native';
import createPlateIcon from '../components/plateIconCreator';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { getReplayData } from '../services/replayService';
import KeepAwake from 'react-native-keep-awake';
import WebView from 'react-native-webview';
import markerIconCreator from '../components/markerIconCreator';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
import Speedometer from '../components/speedometer';
import { CanbusLine } from '../components/lineComponent';
import { getPlakaService } from '../services/getPlakaService';


let interval = null;
let markerResizerInterval = null;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;



const region = {
  latitude: carListStore.mapLT ? carListStore.mapLT : 41.021606,
  longitude: carListStore.mapLG ? carListStore.mapLG : 28.63582,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,};

const initialCoordinateIOS= {
  latitude:carListStore.mapLT, 
  longitude:carListStore.mapLG,
  latitudeDelta: 0.001,
  longitudeDelta: 0.001,};

const navigateGoBack = (cameFrom) => {
  switch (cameFrom) {
    case 'HomeScreen':
      navigationRef.navigate('HomeScreen')
      break;
    case 'AllCarsMap':
      navigationRef.navigate('AllCarsMap')
      break;
    case 'SummaryPage':
      navigationRef.navigate('SummaryPage')
      break;
    default:
      break;
  }
}
let carDetailHeight;
const CarsMap1 = observer(() => {
  const route = useRoute();
  let params = route.params;
  console.log('CAME_FROM',params.cameFrom);
  let mapRef = useRef(null);
  let markerRef = useRef(null);

  const [carMarkersDimension,setCarMarkersDimension] = useState({height:50,width:50});
  const [focus,setFocus] = useState(true);
  const [mapType,setMapType] = useState('standard')
  const [showsTraffic,setShowsTraffic] = useState(false);
  const [ref,setRef] = useState(false);
  const [initialRender,setInitialRender] = useState(true);

  const translation = useRef(new Animated.Value(0)).current;
  const animatedMenu = useRef(new Animated.Value(0)).current;
  const animatedCarDetail = useRef(new Animated.Value(0)).current;
  let data = carListStore.mapCar;
    //DatePicker States
    const [startDate, setStartDate] = useState(new Date(new Date().setHours(7,0,0)));
    const [openStrt, setOpenStrt] = useState(false);
    const [endDate, setEndDate] = useState(new Date());
    const [openEnd, setOpenEnd] = useState(false);
    
    const [selectedButton, setSelectedButton] = useState(1);
    const [showStreetV , setShowStreetV] = useState(false);

    
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

    const [animatedMenuStatus,setAnimatedMenuStatus] = useState(false);
    const [animatedCarDetailSt,setAnimatedCarDetailSt] = useState(false);
    const [carDetailViewHeight, setCarDetailViewHeight]  = useState();
    const changeMarkerType = (markerType) => {
      switch (markerType) {
        case 'dot':
          carListStore.setMapMarkerType('dot');
          changeMarkersIcon('2',carListStore.mapID);
          break;
        case 'icon':
          carListStore.setMapMarkerType('icon');
          changeMarkersIcon('0',carListStore.mapID);
          break;
        case 'image':
          carListStore.setMapMarkerType('image');
          changeMarkersIcon('1',carListStore.mapID);
          break;
        default:
          break;
      }
    }

    const toggleMapType = (mapType) => {
      setSelectedButton(mapType);
      switch (mapType) {
        case (2):
          setMapType('hybrid');
          setShowStreetV(false);
          break;
        case (3):
          setMapType('satellite');
          setShowStreetV(false);
          break;
        case (4):
          setShowStreetV(true);
        default:
          setMapType('standard');
          setShowStreetV(false);
          break;
      }
    };

    const onShare = async () => {
      try {
        const result = await Share.share({
          title:'Araç konum bilgilendirmesi',
          message:
            `Aracınızın konumu:
            ${'\n'}Enlem:${carListStore.mapLT}
            ${'\n'}Boylam:${carListStore.mapLG}
            ${'\n'}URL:${locationURL}`
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        Alert.alert(error.message);
      }
    };
    const [isMounted, setIsMounted] = useState(true);
    useFocusEffect(
      React.useCallback(() => {
        setIsMounted(false);
        setTimeout(() => setIsMounted(true), 100); // WebView yeniden başlatılır
        return () => {
          setIsMounted(false); // Sayfa kapandığında sıfırla
        };
      }, [])
    );
    const changeKeepAwakeSt = (status) => {
      if (status) {
        KeepAwake.activate()
        console.log('AKTİF');
      }
      else {
        KeepAwake.deactivate();
        console.log('PASİF');
      }
    }
  const datePickerIn = () =>{
      Animated.timing(translation, {
          toValue: 450,
          duration: 750,
          useNativeDriver: true,
        }).start();
  }
  const datePickerOut = () =>{
    Animated.timing(translation, {
        toValue: -450,
        duration: 750,
        useNativeDriver: true,
      }).start();
  }
  const animatedMenuIn = () =>{
    console.log('in');
    Animated.timing(animatedMenu, {
        toValue: windowWidth/100 * -45.7,
        duration: 600,
        useNativeDriver: true,
      }).start();
}
const animatedMenuOut = () =>{
  console.log('out');
  Animated.timing(animatedMenu, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
}
const animatedDetailIn = () =>{
  console.log('in');
  Animated.timing(animatedCarDetail, {
      toValue: carDetailViewHeight-30,
      duration: 600,
      useNativeDriver: true,
    }).start();
}
const animatedDetailOut = () =>{
console.log('out');
Animated.timing(animatedCarDetail, {
    toValue: 0,
    duration: 600,
    useNativeDriver: true,
  }).start();
}
  //markerRef.current.animateMarkerToCoordinate({})
  const startCarInterval = () => {
    interval = setInterval(function () {
      getCarsMap(carListStore.mapID);
    }, 5000);
  };
  const clearCarInterval = () => {
    clearInterval(interval);
    interval = null;
  };
  const toggleSwitch = () => {
    changeKeepAwakeSt(!focus)
    setFocus(!focus);
  }
  const createBlokeAlert = data =>
    Alert.alert(
      'UYARI',
      'Araç bloke işleminiz gerçekleşecektir.\nTüm sorumluluk size aittir. Onaylıyor musunuz?',
      [
        {
          text: 'İptal',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Onaylıyorum',
          onPress: () => {
            artesetBlockage(data);
          },
        },
      ],
    );
  const createUnBlokeAlert = data =>
    Alert.alert('UYARI', 'Araç blokeniz kaldırılacaktır.\nOnaylıyor musunuz?', [
      {
        text: 'İptal',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Onaylıyorum',
        onPress: () => {
          arteUnBlockage(data);
        },
      },
    ]);
  const createResetAlert = data =>
    Alert.alert('UYARI', 'Araç resetlenecektir.\nOnaylıyor musunuz?', [
      {
        text: 'İptal',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Onaylıyorum',
        onPress: () => {
          arteReset(data);
        },
      },
    ]);

    const createLocationRequestAlert = id =>
    Alert.alert('Konum talebi', 'Aracınızdan anlık konum paketi istenecektir.\nOnaylıyor musunuz?', [
      {
        text: 'İptal',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Onaylıyorum',
        onPress: () => {
          arteInstantLocationRequest(id);
        },
      },
    ]);
  
let locationURL = Platform.select({
  ios: 'http://maps.apple.com/?daddr='+carListStore.mapLT+','+carListStore.mapLG,
  android:
  'https://www.google.com/maps/search/?api=1&query=' + carListStore.mapLT + ',' + carListStore.mapLG
});

  useEffect(()=>{
    if (Platform.OS == 'android') {
      if (focus && selectedButton !== 4 && selectedButton !== 1) {
        mapRef.current.animateToRegion({
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
          longitudeDelta: 0.013 ,
          latitudeDelta:  0.01 ,
      },2000);
      } else if(focus && selectedButton == 1){
        mapRef.current.animateToRegion({
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
          longitudeDelta: 0.004 ,
          latitudeDelta:  0.001  ,
        },999);
        console.log('standard zooming');
      }
    } else {
      if (focus && selectedButton !== 4) {
        mapRef.current.animateToRegion({
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
      },2000);
    }
    }
  },[carListStore.mapLG,carListStore.mapLT,focus,mapType]);

  const isFocused = useIsFocused();
  
   useEffect(()=>{
    console.log('keep awake',focus);
    changeKeepAwakeSt(focus);
  },[isFocused,focus]);

  useFocusEffect(
    React.useCallback(() => {
      startCarInterval();
      return () => {
        clearCarInterval();
        setFocus(true);
      };
    }, []),
  );
  useEffect(() => {
    setTimeout(()=>{
      mapRef.current.animateToRegion({
        latitude: carListStore.mapLT,
        longitude: carListStore.mapLG,
        latitudeDelta:0.013,
        longitudeDelta:0.01
      },2000);
    },250)
  }, [])
  return (
    <>
    <View style={styles.container}>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigateGoBack(params.cameFrom);
              }}>
              <Icon name="return-up-back" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View style={{alignItems:'center',justifyContent:'center'}} >
            {createPlateIcon('blue', carListStore.mapPlate,'black')}
          </View>
        }
        rightComponent={
          <Switch
            trackColor={{false: '#767577', true: '#009EFF'}}
            thumbColor={'#f4f3f4'}
            style={{ transform: [{ scaleX: .9 }, { scaleY: .8 }] }}
            onValueChange={toggleSwitch}
            ios_backgroundColor="#3e3e3e"
            value={focus}
          />
        }
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: 'gray',
          marginTop: 5,
          marginBottom:-10,
          borderRadius: 10,
        }}>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:2}} >
          <MaterialCommutyIcons
                    name="map-marker-radius"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'center',marginLeft:5}}
                  />
          <Text allowFontScaling={false}  style={{color: '#000', padding: 2, textAlign: 'center',fontSize:14, maxWidth:'85%'}}>{carListStore.mapAdress}</Text>
          <MaterialCommutyIcons
            name="map-marker-radius"
            color={'black'}
            size={24}
            style={{alignSelf:'center'}}
          />
        </View>
        <View style={{flexDirection:'row',margin:2,justifyContent:'space-evenly'}} >
          <Pressable style={selectedButton == 1 ? styles.selectedButton : styles.outlinedButton} onPress={()=>{toggleMapType(1)}} >
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:16,color:'#ffffff'}} >{i18n.t('standard')}</Text>
          </Pressable>
          <Pressable style={[selectedButton == 2 ? styles.selectedButton : styles.outlinedButton,{marginHorizontal:2}]} onPress={()=>{toggleMapType(2)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:16,color:'#ffffff'}} >{i18n.t('hybrid')}</Text>
          </Pressable>
          <Pressable style={[selectedButton == 3 ? styles.selectedButton : styles.outlinedButton,{marginRight:2}]} onPress={()=>{toggleMapType(3)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:16,color:'#ffffff'}} >{i18n.t('satellite')}</Text>
          </Pressable>
          <Pressable style={selectedButton == 4 ? styles.selectedButton : styles.outlinedButton} onPress={()=>{toggleMapType(4)}}>
            <Text allowFontScaling={false} style={{textAlign:'center',fontSize:16,color:'#ffffff'}} >{i18n.t('street')}</Text>
          </Pressable>
        </View>
        {selectedButton == 4 ? (
  <View style={[styles.map, { height: windowHeight }]}>
    <WebView
      style={{ flex: 1, opacity: selectedButton == 4 ? 1 : 0 }}
      onShouldStartLoadWithRequest={() => true}
      startInLoadingState={true}
      allowsBackForwardNavigationGestures={false}
      source={{
        uri:
          "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=" +
          carListStore.mapLT +
          "," +
          carListStore.mapLG +
          "&heading=45&pitch=0&fov=80",
      }}
    />
  </View>
) : null}

        <MapView
          key={'map'}
          ref={mapRef}
          showsUserLocation
          showsTraffic={showsTraffic}
          onLayout={()=>{
            changeMarkerType(carListStore.mapMarkersType);
          }}
          style={[styles.map,{height: animatedCarDetailSt ? (windowHeight/100) * 100 : (windowHeight/1.2) - (carDetailViewHeight ? carDetailViewHeight:windowHeight/2.6) ,}]}
          initialRegion={{
            latitude: carListStore.mapLT ? carListStore.mapLT : 32.124125 ,
            longitude: carListStore.mapLG ? carListStore.mapLG : 26.123125,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,}}
          mapType={mapType}
          rotateEnabled={false}
          >
          {selectedButton !== 4 ?  markerIconCreator(carListStore.mapMarkersType) : null}
        </MapView>

        {carListStore.mapActId == carListStore.mapID ? 
          <ActivityIndicator
            style={{
              position: 'absolute',
              alignSelf: 'center',
              marginTop: '55%',
            }}
            animating={carListStore.mapActI}
            size={30}
            color="red"
          /> 
          : null
        }
      </View>
      <Animated.View
        onLayout={async(event) => {
          setCarDetailViewHeight(event.nativeEvent.layout.height);
          console.log('DETAIL HEIGHT =>',carDetailViewHeight,event.nativeEvent.layout.height)
        }}
        style={[{position:'absolute',bottom:0,width:'100%',},{transform:[
            {translateY:animatedCarDetail}
          ], justifyContent: 'flex-start'}]}>
          <TouchableOpacity style={{flexDirection:'row', opacity:.7, justifyContent:'space-between',bottom:0,backgroundColor:'#434242',borderTopLeftRadius:15,borderTopRightRadius:15,height:'8%',width:'80%',alignSelf:'center'}} onPress={()=>{animatedCarDetailSt ? animatedDetailOut() : animatedDetailIn(); setAnimatedCarDetailSt((st) => !st)}} >
              <Text style={{color:'#fff',marginLeft:10,alignSelf:'center'}} >{i18n.t('show_hide')}</Text>
              <FontAwesome name= {animatedCarDetailSt ? 'angle-up' :'angle-down'} size={30} color='#fff' style={{marginRight:10,alignSelf:'center'}} /> 
            </TouchableOpacity>
        <ScrollView>
          <View style={{flexDirection:'row'}} >
          <View style={{flex:1}}>
            {carListStore.mapST == '2'
                ?
                <View style={{flexDirection:'row',alignSelf:'center',marginVertical:2,marginTop:10, padding:0}} >
                  <View style={{height:20,width:20, backgroundColor:'green', borderRadius:40}}/>
                  <Text allowFontScaling={false} h4 h4Style={{fontSize: 17, color: 'green'}} style={{alignSelf:'flex-end', marginLeft:10,fontWeight:'bold'}}>{i18n.t('moving')}</Text>
                </View>
                : null}
              {carListStore.mapST == '9'
                ? 
                <View style={{flexDirection:'row',alignSelf:'center',marginVertical:2,marginTop:10, padding:0}} >
                  <View style={{height:20,width:20, backgroundColor:'gray', borderRadius:40}}/>
                  <Text allowFontScaling={false} h4 h4Style={{fontSize: 17, color: 'black'}} style={{alignSelf:'flex-end', marginLeft:10,fontWeight:'bold'}}>{i18n.t('passive')}</Text>
                </View>
                : null}
              {carListStore.mapST == '0'
                ? 
                <View style={{flexDirection:'row',alignSelf:'center',marginVertical:2,marginTop:10, padding:0}} >
                  <View style={{height:20,width:20, backgroundColor:'red', borderRadius:40}}/>
                  <Text allowFontScaling={false} h4 h4Style={{fontSize: 17, color: 'red'}} style={{alignSelf:'flex-end', marginLeft:10,fontWeight:'bold'}}>{i18n.t('standing')}</Text>
                </View>
                : null}
              {carListStore.mapST == '1'
                ? 
                <View style={{flexDirection:'row',alignSelf:'center',marginVertical:2,marginTop:10, padding:0}} >
                  <View style={{height:20,width:20, backgroundColor:'yellow', borderRadius:40}}/>
                  <Text allowFontScaling={false} h4 h4Style={{fontSize: 17, color: '#FEC260'}} style={{alignSelf:'flex-end', marginLeft:10,fontWeight:'bold'}}>{i18n.t('idling')}</Text>
                </View>
                : null}
                {
                carListStore.mapCar.DRM2.charAt(7) == 1 ?
                <View style={{flexDirection:'row',alignSelf:'center'}} >
                  <Text allowFontScaling={false} h4 h4Style={{fontSize: 15, color: 'black'}} style={{alignSelf:'flex-end', marginLeft:10,fontWeight:'bold',marginBottom:5,top:-3}}>Bloke edilmiş</Text>
                </View>
                : null
                }
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(locationURL);
                }}
                style={[styles.button,{marginTop:'5%'}]}>
                <FontAwesome
                  name="send"
                  color={'#fff'}
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text allowFontScaling={false} style={styles.text}>{i18n.t('go')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  createBlokeAlert(carListStore.mapID);
                }}
                style={styles.button}>
                <FontAwesome
                  name="exclamation-triangle"
                  color={'#DE0505'}
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text allowFontScaling={false} style={styles.text}>{i18n.t('blockage')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  createUnBlokeAlert(carListStore.mapID);
                }}
                style={styles.button}>
                <FontAwesome
                  name="exclamation-triangle"
                  color={'#fff'}
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text allowFontScaling={false} style={styles.text}>{i18n.t('unblockage')} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  createResetAlert(carListStore.mapID);
                }}
                style={styles.button}>
                <FontAwesome
                  name="exclamation-circle"
                  color={'#fe0'}
                  size={16}
                  style={{marginRight: 10}}
                />
                <Text allowFontScaling={false} style={styles.text}>{i18n.t('reset')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  createLocationRequestAlert(carListStore.mapID);
                }}
                style={styles.button}>
                <FontAwesome
                  name="map-marker"
                  color={'#DE0505'}
                  size={16}
                  style={{marginRight: 10,marginLeft:3}}
                />
                <Text allowFontScaling={false} style={styles.text}>{'Konum iste'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  datePickerIn();
                }}
                style={styles.button}>
                <FontAwesome
                    name="play-circle-o"
                    color={'#B3FFAE'}
                    size={16}
                  style={{marginRight: 10}}
                  />
                <Text allowFontScaling={false} style={[styles.text]}>{i18n.t('replay')} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                
                onPress={() => {
                  setReportModalVisible(true);
                }}
                style={[styles.button,{flexDirection:'row',}]}>
                <Ionicons name='document' color='#FFFFFF' size={18} style={{marginRight:'5%'}} ></Ionicons>
                <Text allowFontScaling={false} style={[styles.text,{fontWeight:'600',alignSelf:'center',textAlign:'center'}]}>{i18n.t('reports')} </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 2}}>
              <Card containerStyle={{borderRadius: 15,marginHorizontal:7, flex: 1,margin:2}}>
                <Text allowFontScaling={false} style={{alignSelf:'center', fontSize:13, fontWeight:'bold',textAlign:'center', marginBottom:5}}>{i18n.t('lastInfo')}{'\n'}{carListStore.mapCar.KT}</Text>
                <Card.Divider style={{borderWidth:1}} />
                <View style={{justifyContent: 'center'}}>
                  <View style={{flexDirection: 'row',marginTop:-5}}>
                    <MaterialIcons
                      name="speed"
                      color={'black'}
                      size={19}
                      style={{alignSelf: 'flex-end', marginRight: 10}}
                    />
                    <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3, color: '#404040',alignSelf:'center'}}>
                      {i18n.t('speed')}:
                    </Text>
                    <Text
                      allowFontScaling={false}
                      h4
                      h4Style={{
                        fontSize: 13,
                        color: '#404040',
                        alignSelf: 'center',
                      }}>
                      {' ' + carListStore.mapCar.SP + '  km/h'}
                    </Text>
                  </View>
                  
                  <View style={{flexDirection: 'row',marginTop:4}}>
                      <MaterialIcons
                        name="timer"
                        color={'black'}
                        size={19}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('parkTime')}: {carListStore.mapCar.PT}
                      </Text>
                    </View>

                  {/*
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <MaterialIcons
                        name="timer"
                        color={'black'}
                        size={19}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('ignitionDate')} {moment(carListStore.mapCar.KT).format('MM/DD HH:mm')}
                      </Text>
                    </View>  
                      */}
                  {carListStore.mapCar.UYDUSAYISI >= 13
                    ?
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <MaterialIcons
                        name = "wifi"
                        color = {'green'}
                        size = {19}
                        style = {{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('satellitePower')} {i18n.t('veryGood')}
                      </Text>
                    </View>
                    : null}
                  {carListStore.mapCar.UYDUSAYISI >= 8 && carListStore.mapCar.UYDUSAYISI <13
                    ? 
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <MaterialIcons
                        name="wifi"
                        color={'green'}
                        size={19}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                      {i18n.t('satellitePower')} {i18n.t('good')}
                      </Text>
                    </View>
                    : null}
                  {carListStore.mapCar.UYDUSAYISI >= 4 && carListStore.mapCar.UYDUSAYISI < 8
                    ? <View style={{flexDirection: 'row',marginTop:4}}>
                        <MaterialIcons
                          name="wifi-off"
                          color={'#FDAF75'}
                          size={19}
                          style={{alignSelf: 'flex-end', marginRight: 10}}
                        />
                        <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('satellitePower')} {i18n.t('bad')}
                        </Text>
                      </View>
                    : null}
                  {carListStore.mapCar.UYDUSAYISI < 4
                    ? <View style={{flexDirection: 'row',marginTop:4}}>
                        <MaterialIcons
                          name="wifi-off"
                          color={'red'}
                          size={19}
                          style={{alignSelf: 'flex-end', marginRight: 10}}
                        />
                        <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('satellitePower')} {i18n.t('veryBad')}
                        </Text>
                      </View>
                    : null}
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <FontAwesome
                        name="road"
                        color={'gray'}
                        size={19}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('dailyKm')}: {carListStore.mapCar.DD}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <FontAwesome
                        name="road"
                        color={'#000'}
                        size={19}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('totalKm')}: {carListStore.mapCar.MS}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row',marginTop:4}}>
                      <FontAwesome
                        name="battery"
                        color={'#000'}
                        size={17}
                        style={{alignSelf: 'flex-end', marginRight: 10}}
                      />
                      <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                        {i18n.t('battery')}: {carListStore.mapCar.AC} V
                      </Text>
                    </View>
                    
                    {carListStore.mapCar.DR && carListStore.mapCar.DR != '-' ? (
                      <View style={{flexDirection: 'row',marginTop:4}}>
                        <FontAwesome
                          name="drivers-license"
                          color={'blue'}
                          size={19}
                          style={{alignSelf: 'flex-end', marginRight: 10}}
                        />
                        <Text allowFontScaling={false} h4 h4Style={{fontSize: 13.3,alignSelf:'center', color: '#404040'}}>
                          {i18n.t('driver')}: {carListStore.mapCar.DR}
                        </Text>
                      </View>
                    ) : null}
                    {carListStore.mapCar.ARACMARKASI && carListStore.mapCar.ARACMARKASI != '-' ? (
                      <View style={{flexDirection: 'row',marginTop:4}}>
                        <MaterialIcons
                          name="label"
                          size={19}
                          style={{alignSelf: 'flex-end', marginRight: 6}}
                        />
                        <Text allowFontScaling={false} h4 h4Style={{fontSize: 13,alignSelf:'center', color: '#404040'}}>
                          {i18n.t('model')}: {carListStore.mapCar.ARACMARKASI}
                        </Text>
                      </View>
                    ) : null}
                  <Card.Divider />
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
      </View>

      {/**SHARE ICON **/}
      <TouchableOpacity style={{position:'absolute',right:-3,top:'24%',padding:6}} onPress={onShare} >
        <View style={{height:35,width:35,borderRadius:24,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}} >
          <FontAwesome name='share-alt' size={20} color='#fff'/>
        </View>
      </TouchableOpacity>
      {/**SHOW TRAFFIC ICON **/}
      <TouchableOpacity style={{position:'absolute',right:0,bottom:'52%' ,padding:2,}} onPress={()=>{setShowsTraffic(!showsTraffic)}} >
        <View style={{height:35,width:35,borderRadius:24,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}} >
          <MaterialCommutyIcons name='traffic-light' size={26} color={showsTraffic ? '#DD5353' : '#ffffff'} />
        </View>
      </TouchableOpacity>
      {/**CANBUS ICON **/}
      <TouchableOpacity style={{position:'absolute',right:0,bottom:'47%' ,padding:2,display:'flex'}} onPress={()=>{setModalVisible(true)}} >
        <View style={{height:35,width:35,borderRadius:24,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}} >
          <MaterialCommutyIcons name='chip' size={26} color={'#ffffff'} />
        </View>
      </TouchableOpacity>
      
      {/* DatePicker start date*/}
      <DatePicker
        locale={i18n.locale}
        maximumDate={new Date()}
        mode="datetime"
        title={i18n.t('startDate')}
        confirmText={i18n.t('confirm')}
        cancelText={i18n.t('cancel')}
        modal
        is24hourSource="locale"
        open={openStrt}
        date={startDate}
        onConfirm={startDate => {
          setOpenStrt(false);
          setStartDate(startDate);
          console.log(startDate);
        }}
        onCancel={() => {
          setOpenStrt(false);
        }}
      />
      
      {/* DatePicker end date*/}
      <DatePicker
        locale={i18n.locale}
        maximumDate={new Date()}
        mode="datetime"
        title={i18n.t('endDate')}
        confirmText={i18n.t('confirm')}
        cancelText={i18n.t('cancel')}
        modal
        is24hourSource="locale"
        open={openEnd}
        date={endDate}
        onConfirm={endDate => {
          setOpenEnd(false);
          setEndDate(endDate);
        }}
        onCancel={() => {
          setOpenEnd(false);
        }}
      />
      <Animated.View style={[{position:'absolute',marginTop:windowHeight-250,marginLeft:-450,width:'100%',},{transform:[
            {translateX:translation}
          ]}]}>
          <View style={{backgroundColor:'white', padding:20, width:'100%',paddingBottom:80,backgroundColor:'#FAF7F0',borderTopRightRadius:20,borderTopLeftRadius:20 }}>
            <Card.Title style={{fontSize: 16}}>{i18n.t('pleasePickADate')}</Card.Title>
            <Card.Divider />
            <Pressable
              style={styles.datePicker}
              onPress={() => {
                setOpenStrt(true);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="calendar"
                  style={{marginRight: 10, color: '#404040'}}
                  type="font-awesome"
                  size={20}
                />
                <Text allowFontScaling={false} style={{marginTop:2, fontSize:17}}>
                  {i18n.t('firstLocation')}
                </Text>
              </View>
              {startDate !== null ? (
                <Text allowFontScaling={false}
                  style={{
                    alignSelf: 'center',
                    textAlign:'right',
                    fontSize: 15,
                    color: '#1F1F1F',
                  }}>
                  {moment(startDate).format('DD-MM-YYYY HH:mm')}
                </Text>
              ) : (
                <Text allowFontScaling={false}
                  style={{
                    fontSize: 17,
                    color: '#FF6B54',
                    marginLeft: 25,
                    alignSelf: 'center',
                  }}>
                  {i18n.t('notSelected')}
                </Text>
              )}
            </Pressable>
            <Pressable
              style={styles.datePicker}
              onPress={() => {
                setOpenEnd(true);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="calendar"
                  style={{marginRight: 10, color: '#404040'}}
                  type="font-awesome"
                  size={20}
                />
                <Text allowFontScaling={false} style={{marginTop:2, fontSize:17}}>
                  {i18n.t('lastLocation')}
                </Text>
              </View>
              {endDate !== null ? (
                <Text allowFontScaling={false}
                  style={{
                    alignSelf: 'center',
                    textAlign:'right',
                    fontSize: 15,
                    color: '#1F1F1F',
                  }}>
                  {moment(endDate).format('DD-MM-YYYY HH:mm')}
                </Text>
              ) : (
                <Text allowFontScaling={false} style={{fontSize: 17, color: '#FF6B54', marginLeft: 25}}>
                  {i18n.t('notSelected')}
                </Text>
              )}
            </Pressable>
            <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center',marginTop:5}}>
              <Button title={i18n.t('close')}
                buttonStyle={{alignSelf:'flex-end', borderRadius:10,width:Dimensions.get('window').width/5}} 
                onPress={()=>{
                  datePickerOut();
                  /*getReplayData({
                    beginDay: moment(startDate).format('MM/DD/YYYY'),
                    endDay: moment(endDate).format('MM/DD/YYYY'),
                    beginTime: moment(startDate).format('HH:mm'),
                    endTime: moment(endDate).format('HH:mm'),
                    carID: carID
                  });*/
                  }}
                  />
              <Button title={i18n.t('get')}
                buttonStyle={{alignSelf:'flex-end', borderRadius:10,width:Dimensions.get('window').width/5}} 
                onPress={()=>{
                  datePickerOut();
                  getReplayData({
                    beginDay: moment(startDate).format('MM/DD/YYYY'),
                    endDay: moment(endDate).format('MM/DD/YYYY'),
                    beginTime: moment(startDate).format('HH:mm'),
                    endTime: moment(endDate).format('HH:mm'),
                  });
                  navigationRef.navigate('ReplayScreen');
                  }}
                  />
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[{position:'absolute',width:windowWidth/100 * 50,marginLeft:0,right:(windowWidth/100 * -45.7),top:'30%'},{transform:[
            {translateX:animatedMenu}
          ]}]}>
          <View style={{flexDirection:'row',flex:1}} >
            <TouchableOpacity style={{justifyContent:'center',backgroundColor:'#434242',borderTopLeftRadius:15,borderBottomLeftRadius:15,padding:3,height:'40%',alignSelf:'center'}} onPress={()=>{animatedMenuStatus ? animatedMenuOut() : animatedMenuIn(); setAnimatedMenuStatus(!animatedMenuStatus)}} >
              <FontAwesome name= {animatedMenuStatus ? 'angle-right' :'angle-left'} size={30} color='#fff' style={{alignSelf:'center'}} /> 
            </TouchableOpacity>
            <View style={{backgroundColor:'#fff',flex:10,padding:4,borderTopLeftRadius:5,borderBottomLeftRadius:5}} >
              <Text style={{textAlign:'center',fontWeight:'600',fontSize:15}} >{i18n.t('settings')}</Text>
              <View style={{width:'65%',borderTopWidth:1,alignSelf:'center',marginVertical:1}} ></View>
              <View style={{flexDirection:'row',marginVertical:2}} >
                <CheckBox
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={carListStore.mapMarkersType == 'icon' ? true : false}
                  onPress={()=>{changeMarkerType('icon')}}
                  containerStyle={{margin:0,padding:0,left:0}}
                />
                <Text style={{alignSelf:'center',marginLeft:-10}} >{i18n.t('direction')}</Text>
              </View>
              <View style={{flexDirection:'row',marginVertical:2}} >
                <CheckBox
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={carListStore.mapMarkersType == 'image' ? true : false}
                  onPress={()=>{changeMarkerType('image')}}
                  containerStyle={{margin:0,padding:0,left:0}}
                />
                <Text style={{alignSelf:'center',marginLeft:-10}} >{i18n.t('car')}</Text>
              </View>
              <View style={{flexDirection:'row',marginVertical:2}} >
                <CheckBox
                  checkedIcon='dot-circle-o'
                  uncheckedIcon='circle-o'
                  checked={carListStore.mapMarkersType == 'dot' ? true : false}
                  onPress={()=>{changeMarkerType('dot')}}
                  containerStyle={{margin:0,padding:0,left:0}}
                />
                <Text style={{alignSelf:'center',marginLeft:-10}} >{i18n.t('dot')}</Text>
              </View>
            </View>
          </View>
          </Animated.View>
          
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
                    <View style={{width: '100%',}}>
                      <Text style={{fontSize: 18, fontWeight: '600', marginLeft: '5%',margin:5}}>
                        {i18n.t('canbus_data')}
                      </Text>
                      <ScrollView>
                      <View  flex={1} style={{marginBottom:50,padding:10}} onStartShouldSetResponder={() => true}> 
                        <Speedometer speed={parseInt(carListStore.mapCar.DSP)} rpm={carListStore.mapCar.DTO} />
                        <View style={{marginTop:'3%'}} />
                          <CanbusLine title={i18n.t('last_diagnostic')} data={carListStore.mapCar.DRD} icon='gears' filled={carListStore.mapCar.DRD ? true : false}/>
                          <CanbusLine title={i18n.t('diagnostic_speed')} data={parseInt(carListStore.mapCar.DSP)} icon='automobile'  content={'km/saat'} filled={carListStore.mapCar.DSP ? true : false}/>
                          <CanbusLine title={i18n.t('daily_distance')} data={carListStore.mapCar.DTR} icon='road' content={'km'} filled={carListStore.mapCar.DTR ? true : false}/>
                          <CanbusLine title={i18n.t('total_distance')} data={carListStore.mapCar.DHD} icon='road' content={'km'} filled={carListStore.mapCar.DHD ? true : false}/>
                          <CanbusLine title={i18n.t('rpm_count')} data={carListStore.mapCar.DTO} icon='repeat' content={'/dk'} filled={carListStore.mapCar.DTO ? true : false}/>
                          <CanbusLine title={i18n.t('fuel_percent')} data={carListStore.mapCar.DFI} icon='percent' content={'%'} filled={carListStore.mapCar.DFI ? true : false}/>
                          <CanbusLine title={i18n.t('daily_spended_gas')} data={carListStore.mapCar.DFD} icon='tint' content={'lt'} filled={carListStore.mapCar.DFD ? true : false}/>
                          <CanbusLine title={i18n.t('total_spended_gas')} data={carListStore.mapCar.DFT} icon='tint' content={'lt'} filled={carListStore.mapCar.DFT ? true : false} />
                          <CanbusLine title={i18n.t('engine_temp')} data={carListStore.mapCar.DET} icon='thermometer-full' content={'°C'} filled={carListStore.mapCar.DET ? true : false}/>
                          <CanbusLine title={i18n.t('car_weight')} data={carListStore.mapCar.WGH} icon='truck' content={'kg'}  filled={carListStore.mapCar.WGH ? true : false}/>
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          </Modal>
          <Modal
            style={{flex:1}}
            animationType="slide"
            transparent={true}
            visible={reportModalVisible}
            onRequestClose={() => {
              setReportModalVisible(false);
            }}>
            <TouchableOpacity style={{flex:1}} onPress={()=>{setReportModalVisible(!reportModalVisible)}} >
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={[styles.modalView,{height:'30%',backgroundColor:'#434242',borderBottomLeftRadius:0,borderBottomRightRadius:0}]}>
                    <ScrollView style={{width: '100%',}}>
                      <Text style={{fontSize: 18, fontWeight: '600', marginLeft: '5%',margin:5,color:'#FFFFFF'}}>
                        {i18n.t('chooseReport')}
                      </Text>
                      <TouchableOpacity
                        style={{width:'100%',padding:5,margin:3, borderTopWidth:0.3,borderColor:'#FFFFFF', flexDirection:'row',justifyContent:'space-between'}}
                        onPress={()=>{
                          setReportModalVisible(false);
                          getPlakaService();
                          navigationRef.navigate('DrawerRoot', {
                          screen: 'ActivitySummary',
                          params: {
                            plate: carListStore.mapPlate,
                            id: carListStore.mapID
                           },
                          });
                        }}>
                        <Text allowFontScaling={false} style={{fontSize:14, marginLeft:'5%',alignSelf:'center',textAlign:'center',color:'#FFFFFF'}}>{i18n.t('activity_summary')}</Text>
                        <Ionicons name='document' color={'#FFFFFF'} size={22} style={{marginRight:'5%'}} ></Ionicons>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{width:'100%', padding:5,margin:3, borderTopWidth:0.3,flexDirection:'row',justifyContent:'space-between',borderColor:'#FFFFFF',}}
                        onPress={()=>{
                          setReportModalVisible(false);
                          getPlakaService();
                          navigationRef.navigate('DrawerRoot', {
                          screen: 'ActivityDetail',
                          params: {
                            plate: carListStore.mapPlate,
                            id: carListStore.mapID
                           },
                          });
                        }}>
                        <Text allowFontScaling={false}  style={{fontSize:14, marginLeft:'5%',alignSelf:'center',textAlign:'center',color:'#FFFFFF'}} >{i18n.t('activity_detail')}</Text>
                        <Ionicons name='document' color='#FFFFFF' size={22} style={{marginRight:'5%'}} ></Ionicons>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{width:'100%', padding:5,margin:3, borderTopWidth:0.3,flexDirection:'row',justifyContent:'space-between',borderColor:'#FFFFFF',}}
                        onPress={()=>{
                          setReportModalVisible(false);
                          getPlakaService();
                          navigationRef.navigate('DrawerRoot', {
                          screen: 'IgnitionReport',
                          params: {
                            plate: carListStore.mapPlate,
                            id: carListStore.mapID
                           },
                          });
                        }}>
                        <Text allowFontScaling={false}  style={{fontSize:14, marginLeft:'5%',alignSelf:'center',textAlign:'center',color:'#FFFFFF'}} >{i18n.t('ignition_based')}</Text>
                        <Ionicons name='document' color='#FFFFFF' size={22} style={{marginRight:'5%'}} ></Ionicons>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableOpacity>
          </Modal>
    </>
  );
});
export default CarsMap1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEFEF',
  },
  map: {
    borderRadius: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'justify',
    margin: 2,
  },
  button: {
    padding: 5,
    margin: 1.5,
    backgroundColor: '#2C3333',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13.3,
  },
  buttonDisable: {
    padding: 10,
    margin: 1,
    backgroundColor: 'red',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePicker: {
    borderWidth: 0.2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginTop:5,
    margin:2
  },
  selectedButton: {
    backgroundColor:'#579BB1',
    flex:1,
    margin:0,
    borderRadius:3
  },
  outlinedButton: {
    backgroundColor:'gray',
    flex:1,
    margin:0,
    borderRadius:3
  },
  centeredView: {
    flex: 1,
    justifyContent:'flex-end'
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignSelf:'flex-end',
    height: '74%',
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
  item: {
    margin: 2,
    marginHorizontal:5,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    borderWidth:0.2,
    backgroundColor:'#FFFFFF',
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
});
