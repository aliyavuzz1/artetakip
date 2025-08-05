import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Button, Card, Chip, Header, Switch} from 'react-native-elements';
import MapView, {
  Callout,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {ActivityIndicator} from 'react-native-paper';
import {navigationRef} from '../navigation/navigationRef';
import Ionicons from 'react-native-vector-icons/Ionicons';
import carListStore from '../store/carListStore';
import {Slider, Text, Icon} from 'react-native-elements';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {replayColors} from '../services/replayService';
import createPlateIcon from '../components/plateIconCreator';
import {toJS} from 'mobx';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import sellerStore from '../store/sellerStore';
import sellerUI from '../../assets/sellerUI/sellerUI';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
let interval = null;
let intervalBack = null;

/*const initialCoordinate = toJS(carListStore.polylineCoordinates);
const region = {
  latitude: carListStore.polylineCoordinates[0].latitude,
  longitude: carListStore.polylineCoordinates[0].longitude,
  latitudeDelta: 0.021,
  longitudeDelta: 0.021,};
  console.log('REGIOOOOOON <---->',region);*/
const toggleSpeed = speed => {
  if (speed == 100) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="run-fast" size={32} color="#083AA9">
          <Text style={{fontSize: 17, color: '#FEFEFE'}}>x8</Text>
        </MaterialCommunityIcons>
      </View>
    );
  } else if (speed == 200) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="run-fast" size={32} color="#083AA9">
          <Text style={{fontSize: 17, color: '#FEFEFE'}}>x4</Text>
        </MaterialCommunityIcons>
      </View>
    );
  } else if (speed == 400) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="run" size={32} color="#083AA9">
          <Text style={{fontSize: 17, color: '#FEFEFE'}}>x2</Text>
        </MaterialCommunityIcons>
      </View>
    );
  } else if (speed == 800) {
    return (
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="run" size={32} color="#083AA9">
          <Text style={{fontSize: 17, color: '#FEFEFE'}}>x1</Text>
        </MaterialCommunityIcons>
      </View>
    );
  }
};

const ReplayScreen = () => {
  let mapViewRef = useRef(null);

  let carID = carListStore.carID;
  let plate = carListStore.mapPlate;
  let totalIndex = carListStore.polylineCoordinates.length;
  let index = 0;
  const [value, setValue] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(800);
  const [stop, setStop] = useState(true);
  const [focus, setFocus] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translation = useRef(new Animated.Value(0)).current;
  const translationMap = useRef(new Animated.Value(0)).current;
  const [displayAlarms, setDisplayAlarms] = useState(false);
  //Sayfa değiştiğinde intervalleri temizleyen hook
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        clearBackReplayInterval();
        clearReplayInterval();
      };
    }, []),
  );

  //Markerı ileri hareket ettiren 'interval'
  const startReplayInterval = (test = value) => {
    if (test >= totalIndex - 1) {
      return null;
    } else {
      setValue(value => value + 1);
      console.log('timeout', test, '<----->', totalIndex);
      interval = setTimeout(() => startReplayInterval(test + 1), replaySpeed);
    }
  };
  //clear ileri 'interval'
  const clearReplayInterval = () => {
    clearTimeout(interval);
    interval = null;
  };
  //Markerı geri hareket ettiren 'intervalBack'
  const startBackReplayInterval = (test = value) => {
    console.log('geriiiiii');
    if (test <= 0) {
      return null;
    } else {
      setValue(value => value - 1);
      console.log('timeout', test, '<----->', totalIndex);
      intervalBack = setTimeout(
        () => startBackReplayInterval(test - 1),
        replaySpeed,
      );
    }
  };
  //clear 'intervalBack'
  const clearBackReplayInterval = () => {
    clearTimeout(intervalBack);
    intervalBack = null;
  };
  //replay speed changer function
  const speedChanger = () => {
    console.log('reokaySped', replaySpeed);
    if (replaySpeed == 800) {
      setReplaySpeed(400);
    } else if (replaySpeed == 400) {
      setReplaySpeed(200);
    } else if (replaySpeed == 200) {
      setReplaySpeed(100);
    } else if (replaySpeed == 100) {
      setReplaySpeed(800);
    }
  };

  let coordinates = toJS(carListStore.polylineCoordinates);
  let initialDistance = coordinates[0].DS;

  const region = {
    latitude: carListStore.polylineCoordinates[0].latitude,
    longitude: carListStore.polylineCoordinates[0].longitude,
    latitudeDelta: 0.021,
    longitudeDelta: 0.021,
  };
  //Animate MapView when markers region is change
  useEffect(() => {
    if (focus) {
      mapViewRef.current.animateToRegion(
        {
          latitude: coordinates[value].latitude,
          longitude: coordinates[value].longitude,
          longitudeDelta: 0.02,
          latitudeDelta: 0.01,
        },
        replaySpeed + 150,
      );
    }
  }, [value]);

  //Animasyonlar
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  };
  const mapUpside = () => {
    Animated.timing(translationMap, {
      toValue: 220,
      duration: 4000,
      useNativeDriver: true,
    }).start();
  };
  /////////

  //MapView will animate to nextRegion
  let nextRegion = {
    latitude: coordinates[value].latitude,
    longitude: coordinates[value].longitude,
  };
  const toggleSwitch = () => {
    setDisplayAlarms(previousState => !previousState);
  };
  const toggleSwitchv2 = () => {
    setFocus(previousState => !previousState);
  };
  fadeIn();
  mapUpside();

  return (
    <View
      style={{
        backgroundColor: '#EFEFEFEF',
        flex: 1,
        height: '100%',
        width: '100%',
      }}>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <Pressable
              style={{marginLeft: 10}}
              onPress={() => {
                navigationRef.goBack();
              }}>
              <Ionicons name="return-up-back" color="#FFFFFF" size={26} />
            </Pressable>
          </View>
        }
        centerComponent={
          <View style={styles.heading}>
            {createPlateIcon('blue', plate, 'black')}
          </View>
        }
        rightComponent={
          <Pressable
            disabled={!stop}
            onPress={() => {
              speedChanger();
              console.log('bastı');
            }}>
            {toggleSpeed(replaySpeed)}
          </Pressable>
        }
      />
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: 'gray',
          borderRadius: 10,
        }}>
        <Animated.View style={{opacity: fadeAnim}}>
          <MapView
            key={'map2'}
            ref={mapViewRef}
            enableLatestRenderer={true}
            showsUserLocation
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            region={region}>
            <Polyline
              coordinates={coordinates}
              strokeColor="#2146C7" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={replayColors}
              strokeWidth={3}
            />
            {coordinates.map((data, i) => {
              if (data.AD) {
                return (
                  <Marker
                    key={'index1' + i}
                    coordinate={data}
                    centerOffset={{x: 0, y: 0}}
                    anchor={{x: 0.45, y: 0.8}}
                    zIndex={i}
                    title={data.AD}
                    style={{display: displayAlarms ? 'flex' : 'none'}}>
                    <Image
                      source={require('../../assets/global/warn.gif')}
                      resizeMethod="scale"
                      resizeMode="contain"
                      style={{height: 20}}
                    />
                  </Marker>
                );
              }
            })}
            <Marker
              key={'index234567'}
              tracksViewChanges={true}
              anchor={{x: 0.5, y: 0.6}}
              coordinate={coordinates[value]}
              hitSlop={{top: 0, bottom: 0, right: 0, left: 0}}
              style={{
                zIndex: 10000,
                transform: [{rotate: coordinates[value].RT + 'deg'}],
              }}>
              <MaterialIcons name={'navigation'} color={'red'} size={30} />
              <Text allowFontScaling={false} style={{width: 0, height: 0}}>
                {Math.random()}
              </Text>
            </Marker>
          </MapView>
          {
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
          }
          {Platform.OS === 'ios' ? (
            <View
              style={{flexDirection: 'row', marginTop: 2, marginHorizontal: 6}}>
              <View style={{padding: 3, backgroundColor: '#FF4600', flex: 1}} />
              <View style={{padding: 3, backgroundColor: '#D3D301', flex: 1}} />
              <View style={{padding: 3, backgroundColor: '#00A423', flex: 1}} />
              <View style={{padding: 3, backgroundColor: '#00FFD8', flex: 1}} />
              <View style={{padding: 3, backgroundColor: '#0078FF', flex: 1}} />
              <View style={{padding: 3, backgroundColor: '#8300FF', flex: 1}} />
            </View>
          ) : null}
          <View
            style={{
              padding: 7,
              alignItems: 'stretch',
              justifyContent: 'center',
            }}>
            <View style={{marginHorizontal: 6}}>
              <Slider
                value={value}
                onValueChange={value => setValue(value)}
                minimumValue={0}
                maximumValue={coordinates.length - 1}
                step={1}
                trackStyle={{height: 8, backgroundColor: 'transparent'}}
                thumbStyle={{
                  height: 20,
                  width: 20,
                  backgroundColor: 'transparent',
                }}
                thumbProps={{
                  children: stop ? (
                    <Icon
                      name="play"
                      type="font-awesome"
                      size={15}
                      reverse
                      containerStyle={{bottom: 15, right: 20}}
                      color="#42855B"
                    />
                  ) : (
                    <Icon
                      name="pause"
                      type="font-awesome"
                      size={15}
                      reverse
                      containerStyle={{bottom: 15, right: 20}}
                      color="red"
                    />
                  ),
                }}
              />
            </View>
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                margin: 5,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  margin: 2,
                  color: '#674747',
                }}>
                Tarih&Saat: {coordinates[value].TA}
              </Text>
              <View style={{borderWidth: 0.4}}></View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                  justifyContent: 'space-evenly',
                }}>
                <Chip
                  title={'Geri'}
                  titleStyle={{marginRight: 8, color: '#fff'}}
                  containerStyle={{}}
                  icon={
                    <AntDesign name="stepbackward" size={16} color="#fff" />
                  }
                  disabled={!stop}
                  buttonStyle={
                    stop ? styles.buttonEnable : styles.buttonDisable
                  }
                  onPress={() => {
                    startBackReplayInterval();
                    setStop(!stop);
                  }}
                  type="outline"
                />
                <Chip
                  icon={
                    <Entypo
                      name="controller-paus"
                      color={'#fff'}
                      size={16}></Entypo>
                  }
                  disabled={stop}
                  buttonStyle={
                    !stop ? styles.buttonPauseEnable : styles.buttonDisable
                  }
                  onPress={() => {
                    clearReplayInterval();
                    clearBackReplayInterval();
                    setStop(!stop);
                  }}
                  type="outline"
                />
                <Chip
                  title={'İleri'}
                  titleStyle={{marginRight: 8, color: '#fff'}}
                  containerStyle={{}}
                  iconRight
                  icon={
                    <AntDesign
                      name="stepforward"
                      type="font-awesome"
                      size={16}
                      color="#fff"
                    />
                  }
                  disabled={!stop}
                  buttonStyle={
                    stop ? styles.buttonEnable : styles.buttonDisable
                  }
                  onPress={() => {
                    startReplayInterval();
                    setStop(!stop);
                  }}
                  type="outline"
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="speedometer-outline"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      textAlign: 'center',
                    }}>
                    Hız:
                  </Text>
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    {' ' + coordinates[value].SP + '  km/h'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {coordinates[value].ST == 1 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        h4
                        h4Style={{
                          fontSize: 15,
                          color: '#404040',
                          textAlign: 'center',
                        }}>
                        Rölantide
                      </Text>
                      <Ionicons
                        name="navigate-circle"
                        color={'#FFD384'}
                        size={24}
                        style={{alignSelf: 'flex-end', marginLeft: 10}}
                      />
                    </View>
                  ) : null}
                  {coordinates[value].ST == 2 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        h4
                        h4Style={{
                          fontSize: 15,
                          color: '#404040',
                          textAlign: 'center',
                        }}>
                        Hareketli
                      </Text>
                      <Ionicons
                        name="navigate-circle"
                        color={'#42855B'}
                        size={24}
                        style={{alignSelf: 'flex-end', marginLeft: 10}}
                      />
                    </View>
                  ) : null}
                  {coordinates[value].ST == 0 ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        h4
                        h4Style={{
                          fontSize: 15,
                          color: '#404040',
                          textAlign: 'center',
                        }}>
                        Duran
                      </Text>
                      <Ionicons
                        name="navigate-circle"
                        color={'#F96666'}
                        size={24}
                        style={{alignSelf: 'flex-end', marginLeft: 10}}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 6,
                  }}>
                  <FontAwesome
                    name="road"
                    color={'black'}
                    size={24}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      textAlign: 'center',
                    }}>
                    Mesafe :
                  </Text>
                  <Text
                    h4
                    h4Style={{
                      fontSize: 15,
                      color: '#404040',
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    {' ' +
                      (
                        parseFloat(coordinates[value].DS) - initialDistance
                      ).toFixed(2) +
                      ' km'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 15, marginRight: 3, textAlign: 'center'}}>
                    Alarm
                  </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#CF0A0A'}}
                    thumbColor={'#f4f3f4'}
                    style={{transform: [{scaleX: 0.9}, {scaleY: 0.8}]}}
                    onValueChange={toggleSwitch}
                    ios_backgroundColor="#3e3e3e"
                    value={displayAlarms}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-end',
                }}>
                <Text
                  style={{fontSize: 14, marginRight: 3, textAlign: 'center'}}>
                  Odak
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: 'blue'}}
                  thumbColor={'#f4f3f4'}
                  style={{transform: [{scaleX: 0.9}, {scaleY: 0.8}]}}
                  onValueChange={toggleSwitchv2}
                  ios_backgroundColor="#3e3e3e"
                  value={focus}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default ReplayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  map: {
    height: Dimensions.get('window').height / 1.85,
    borderRadius: 5,
    marginTop: 0,
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  datePicker: {
    borderWidth: 0.2,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 5,
    margin: 2,
  },
  buttonDisable: {
    backgroundColor: 'gray',
  },
  buttonEnable: {
    backgroundColor: '#42855B',
  },
  buttonPauseEnable: {
    backgroundColor: 'red',
  },
});
