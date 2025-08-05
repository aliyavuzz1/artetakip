import React, {Component, useRef, useState} from 'react';
import {Text, View, Image} from 'react-native';
import {Marker} from 'react-native-maps';
import {Svg} from 'react-native-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import carListStore from '../store/carListStore';
const markerIconCreator = (markerType, markerDimensions) => {
  if (markerType == 'icon') {
    return (
      <Marker
        tracksViewChanges={true}
        coordinate={{
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
        }}
        style={{transform: [{rotate: carListStore.mapRotate + 'deg'}]}}
        anchor={{x: 0.33, y: 0.37}}
        centerOffset={{x: 0.4, y: 0.6}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <MaterialIcons
          name={'navigation'}
          color={carListStore.mapMarkersIconColor}
          size={30}
        />
        <Text allowFontScaling={false} style={{width: 0, height: 0}}>
          {Math.random()}
        </Text>
      </Marker>
    );
  } else if (markerType == 'image') {
    return (
      <Marker
        tracksViewChanges={true}
        coordinate={{
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
        }}
        style={{transform: [{rotate: carListStore.mapRotate + 'deg'}]}}
        anchor={{x: 0.33, y: 0.37}}
        centerOffset={{x: 0, y: 0}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
     
          <Image
            source={carListStore.mapMarkersImage}
            style={{height: 50, width: 50}}
            resizeMethod="scale"
            resizeMode="contain"
          />
     
        <Text allowFontScaling={false} style={{width: 0, height: 0}}>
          {Math.random()}
        </Text>
      </Marker>
    );
  } else if (markerType == 'dot') {
    return (
      <Marker
        tracksViewChanges={true}
        coordinate={{
          latitude: carListStore.mapLT,
          longitude: carListStore.mapLG,
        }}
        style={{transform: [{rotate: carListStore.mapRotate + 'deg'}]}}
        anchor={{x: 0.33, y: 0.37}}
        centerOffset={{x: 0.28, y: 0.2}}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <MaterialIcons
          name={'stop-circle'}
          color={carListStore.mapMarkersIconColor}
          size={24}
        />
        <Text allowFontScaling={false} style={{width: 0, height: 0}}>
          {Math.random()}
        </Text>
      </Marker>
    );
  }
};
export default markerIconCreator;
