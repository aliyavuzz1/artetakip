import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, Pressable, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import MaterialCommutyIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import carListStore from '../store/carListStore';
import { getAllCarsMap, getCarsMap } from '../services/mapService';
import { createPlateIconForAllCars } from '../components/plateIconCreator';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
import { navigationRef } from '../navigation/navigationRef';

const AllCarsMap = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [mapType, setMapType] = useState('standard');
  const [selectedButton, setSelectedButton] = useState(1);
  const [showsTraffic, setShowsTraffic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  let interval = null;

  // Veri yükleme ve marker ID'leri oluşturma
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      await getAllCarsMap();
      setIsLoading(false);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setIsLoading(false);
    }
  }, []);

  // Interval işlemleri
  const startCarInterval = useCallback(() => {
    if (!interval) {
      interval = setInterval(() => {
        getAllCarsMap();
      }, 30000);
      setIsEnabled(true);
    }
  }, []);

  const clearCarInterval = useCallback(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      setIsEnabled(false);
    }
  }, []);

  const toggleCarInterval = useCallback(() => {
    if (interval) {
      clearCarInterval();
    } else {
      startCarInterval();
    }
  }, [interval]);

  // Ekran odaklandığında çalışacak efekt
  useFocusEffect(
    useCallback(() => {
      loadData();
      startCarInterval();
      return () => {
        clearCarInterval();
      };
    }, [])
  );

  // Harita türü değiştirme
  const toggleMapType = useCallback((type) => {
    setSelectedButton(type);
    switch (type) {
      case 2:
        setMapType('hybrid');
        break;
      case 3:
        setMapType('satellite');
        break;
      default:
        setMapType('standard');
    }
  }, []);

  // Marker ID'leri oluştur
  const markerIDs = carListStore.allCarsMap?.map((_, index) => `markerID${index}`) || [];

  // Yükleniyor durumu
  if (isLoading || !carListStore.allCarsMap) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        key="map"
        enableLatestRenderer={true}
        ref={mapRef}
        rotateEnabled={false}
        showsUserLocation
        showsTraffic={showsTraffic}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        mapType={mapType}
        mapPadding={{ top: 10, right: 40, bottom: 10, left: 40 }}
        onMapReady={() => {
          if (markerIDs.length > 0) {
            mapRef.current?.fitToSuppliedMarkers(
              markerIDs,
              { edgePadding: { top: 70, right: 70, bottom: 70, left: 70 } },
              true
            );
          }
        }}
        region={{
          latitude: 38.439607,
          longitude: 34.884025,
          latitudeDelta: 1,
          longitudeDelta: 16,
        }}>
        {carListStore.allCarsMap.map((data, index) => (
          <Marker
            key={`map-${index}`}
            identifier={`markerID${index}`}
            anchor={{ x: 0.5, y: 0.75 }}
            onPress={async () => {
              await getCarsMap(data.ID);
              carListStore.setCarReplayID(data.ID);
              navigationRef.navigate('CarsMap1', { cameFrom: 'AllCarsMap' });
            }}
            coordinate={{
              latitude: data.LT ? parseFloat(data.LT) : 0,
              longitude: data.LG ? parseFloat(data.LG) : 0,
            }}>
            <View style={{ overflow: 'visible' }}>
              {createPlateIconForAllCars(
                data.ST === '2' ? 'green' : 
                data.ST === '9' ? 'black' : 
                data.ST === '0' ? 'red' : '#FEE440',
                data.P,
                '#000',
                null,
                data.ST === '2' ? data.SP : null,
                data.RT
              )}
            </View>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={{ position: 'absolute', right: 0, top: '25%', padding: 2 }}
        onPress={() => setShowsTraffic(!showsTraffic)}>
        <MaterialCommutyIcons
          name="traffic-light"
          size={30}
          color={showsTraffic ? '#DD5353' : '#434242'}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
    borderRadius: 10,
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

export default AllCarsMap;