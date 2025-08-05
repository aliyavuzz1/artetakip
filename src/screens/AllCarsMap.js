import AsyncStorage from '@react-native-async-storage/async-storage';

import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Pressable,
} from 'react-native';
import {Button, Header} from 'react-native-elements';
import carListStore from '../store/carListStore';
import {navigationRef} from '../navigation/navigationRef';
import {useFocusEffect} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import  {PROVIDER_DEFAULT, Marker, Callout} from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import getCarsMap, {getAllCarsMap} from '../services/mapService';
import createPlateIcon, {
  createPlateIconForAllCars,
} from '../components/plateIconCreator';
import sellerStore from '../store/sellerStore';
import {i18n} from '../localization';
import MaterialCommutyIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import sellerUI from '../../assets/sellerUI/sellerUI';
import MapView from "react-native-map-clustering";

let interval = null;

const AllCarsMap = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const [pinColor, setPinColor] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [totalVehicle, setTotalVehicle] = useState(0);

  const [mapType, setMapType] = useState('standard');
  const [selectedButton, setSelectedButton] = useState(1);
  const [showsTraffic, setShowsTraffic] = useState(false);
  let markerIDs = [];
  for (let i = 0; i < carListStore.allCarsMap.length; i++) {
    markerIDs.push(`markerID${i}`);
  }
  const toggleMapType = mapType => {
    setSelectedButton(mapType);
    if (mapType == 2) {
      setMapType('hybrid');
    } else if (mapType == 3) {
      setMapType('satellite');
    } else {
      setMapType('standard');
    }
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    toggleCarInterval();
  };

  const startCarInterval = () => {
    interval = setInterval(function () {
      getAllCarsMap();
    }, 30000);
    setIsEnabled(true);
  };
  const clearCarInterval = () => {
    clearInterval(interval);
    interval = null;
    setIsEnabled(false);
  };
  const toggleCarInterval = () => {
    if (interval == null) {
      startCarInterval();
    } else {
      clearCarInterval();
      console.log('====================================');
      console.log('clearlandı');
      console.log('====================================');
    }
  };
  const mapRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      startCarInterval();
      return () => {
        clearCarInterval();
      };
    }, []),
  );

  return (
    <>
      <View style={{flex: 1}}>
        <Header
          backgroundColor={sellerUI.color3}
          leftComponent={
            <View>
              <TouchableOpacity
                style={{marginLeft: 10}}
                onPress={() => {
                  navigationRef.dispatch(DrawerActions.toggleDrawer());
                }}>
                <Icon name="menu" color={sellerUI.color4} size={30} />
              </TouchableOpacity>
            </View>
          }
          centerComponent={{text: i18n.t('allCars'), style: styles.heading}}
          rightComponent={
            <View style={{marginTop: -10}}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  toggleSwitch();
                }}>
                <View style={{justifyContent: 'center'}}>
                  <Text
                    style={{fontSize: 14, textAlign: 'center', color: 'black'}}>
                    {i18n.t('refresh')}
                  </Text>

                  <Switch
                    trackColor={{false: '#767577', true: '#f4f4f4'}}
                    thumbColor={isEnabled ? 'green' : '#f4f3f4'}
                    style={{transform: [{scaleX: 0.9}, {scaleY: 0.8}]}}
                    onValueChange={toggleSwitch}
                    ios_backgroundColor="#3e3e3e"
                    value={isEnabled}
                  />
                </View>
              </TouchableOpacity>
            </View>
          }
        />
        <View
          style={{
            flexDirection: 'row',
            margin: 2,
            justifyContent: 'space-evenly',
          }}>
          <Pressable
            style={
              selectedButton == 1
                ? styles.selectedButton
                : styles.outlinedButton
            }
            onPress={() => {
              toggleMapType(1);
            }}>
            <Text style={{textAlign: 'center', fontSize: 16, color: '#ffffff'}}>
              {i18n.t('standard')}
            </Text>
          </Pressable>
          <Pressable
            style={[
              selectedButton == 2
                ? styles.selectedButton
                : styles.outlinedButton,
              {marginHorizontal: 2},
            ]}
            onPress={() => {
              toggleMapType(2);
            }}>
            <Text style={{textAlign: 'center', fontSize: 16, color: '#ffffff'}}>
              {i18n.t('hybrid')}
            </Text>
          </Pressable>
          <Pressable
            style={
              selectedButton == 3
                ? styles.selectedButton
                : styles.outlinedButton
            }
            onPress={() => {
              toggleMapType(3);
            }}>
            <Text style={{textAlign: 'center', fontSize: 16, color: '#ffffff'}}>
              {i18n.t('satellite')}
            </Text>
          </Pressable>
        </View>
        
<MapView
  key={'map'}
  ref={mapRef}
  rotateEnabled={false}
  showsUserLocation
  showsTraffic={showsTraffic}
  provider={PROVIDER_DEFAULT}
  style={styles.map}
  mapType={mapType}
  clusteringEnabled={true}
  radius={40}
  clusterColor="black"
  clusterTextColor="white"
  mapPadding={{top: 10, right: 40, bottom: 10, left: 40}}
  onMapReady={() => {
    mapRef.current.fitToSuppliedMarkers(
      markerIDs,
      {edgePadding: {top: 70, right: 70, bottom: 70, left: 70}},
      true,
    );
  }}
  region={{
    latitude: 38.439607,
    longitude: 34.884025,
    latitudeDelta: 1,
    longitudeDelta: 16,
  }}
>
  {carListStore.allCarsMap.map((data, index) => {
    const lat = parseFloat(data.LT);
    const lng = parseFloat(data.LG);

    if (!lat || !lng) return null;

    return (
      <Marker
        key={'map' + index}
        identifier={'markerID' + index}
        anchor={{x: 0.5, y: 0.75}}
        onPress={async () => {
          await getCarsMap(data.ID);
          carListStore.setCarReplayID(data.ID);
          navigationRef.navigate('CarsMap1', {
            cameFrom: 'AllCarsMap',
          });
        }}
        coordinate={{latitude: lat, longitude: lng}}
      >
        <View style={{overflow: 'visible'}}>
          {data.ST == '2' &&
            createPlateIconForAllCars('green', data.P, '#000', null, data.SP, data.RT)}
          {data.ST == '9' &&
            createPlateIconForAllCars('black', data.P, '#000', null, null, data.RT)}
          {data.ST == '0' &&
            createPlateIconForAllCars('red', data.P, '#000', null, null, data.RT)}
          {data.ST == '1' &&
            createPlateIconForAllCars('#FEE440', data.P, '#000', null, null, data.RT)}
        </View>
      </Marker>
    );
  })}
</MapView>
        <TouchableOpacity
          style={{position: 'absolute', right: 0, top: '25%', padding: 2}}
          onPress={() => {
            setShowsTraffic(!showsTraffic);
          }}>
          <MaterialCommutyIcons
            name="traffic-light"
            size={30}
            color={showsTraffic ? '#DD5353' : '#434242'}
          />
        </TouchableOpacity>
        {/*<ActivityIndicator style={{position:'absolute', alignSelf:'center',marginTop:'60%'}} animating={true} size={26} color='red' />*/}
      </View>
    </>
  );
});

export default AllCarsMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    margin: 2,
    color: sellerUI.color4,
  },
  selectedButton: {
    backgroundColor: '#579BB1',
    flex: 1,
    margin: 0,
    borderRadius: 3,
  },
  outlinedButton: {
    backgroundColor: 'gray',
    flex: 1,
    margin: 0,
    borderRadius: 3,
  },
});
