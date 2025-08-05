import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Pressable, Text} from 'react-native';
import { navigationRef } from '../navigation/navigationRef';
import getCarsMap from '../services/mapService';
import carListStore from '../store/carListStore';
import createPlateIcon from './plateIconCreator';
import createCarStatus from './createCarStatus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import moment from 'moment';
  
const CarListv3 = observer((props) => {
  const data = props.data;
  const color = props.color;

      return (
      <Pressable
        style={{marginVertical:4}}
        onPress={async () => {
            //console.log(id);
            await getCarsMap(data.ID);
            carListStore.setCarReplayID(data.ID);
            navigationRef.navigate('CarsMap1',{cameFrom:'HomeScreen'});
        }}
       >
        <View style={styles.item} >
            <View style={{alignSelf:'center', marginLeft:4}} >
                {createPlateIcon(color,data.P,'#000',100)}
            </View>
            <View style={[styles.seperate,{borderColor:color}]} />
            <View style={{flex:7}} >
                <View style={{flexDirection:'row',marginTop:5,marginLeft:5}}>
                  <View style={{flexDirection:'row',flex:1}}>
                    <Ionicons name='speedometer' color={color} size={26} style={{alignSelf:'center',}} />
                    <Text style={{color:'#393E46', alignSelf:'center', marginLeft:5}}>{data.SP} km/h</Text>
                  </View>
                  <View style={{flexDirection:'row',marginTop:5,marginLeft:5,flex:1}}>
                    <Ionicons name='ios-calendar' color={color} size={26} style={{alignSelf:'center'}} />
                    <Text style={{color:'#393E46', alignSelf:'center', marginLeft:5, fontSize:14}}>{data.ST == 'black' ? moment(data.KT).format('DD-MM-YYYY'):moment(data.KT).format('HH:mm')  }</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',marginTop:5,marginLeft:5}}>
                    <Ionicons name='location' color={color} size={26} style={{alignSelf:'center'}} />
                    <Text style={{color:'#393E46', alignSelf:'center', marginLeft:2, fontSize:13}}>{data.LK.length < 25 ? data.LK : data.LK.substring(0,25)+'...' }</Text>
                </View>
            </View>
            <MaterialIcons name='keyboard-arrow-right' size={28} color={'#333333'} style={{alignSelf:'center',flex:1}}/>
        </View>
      </Pressable>
      );
    });
;


export default CarListv3;


const styles = StyleSheet.create({
  item: {
    backgroundColor:'#EFEFEFEF',
    marginLeft:5,
    marginRight:5, 
    aspectRatio:1*5,
    borderWidth:0.4,
    flexDirection:'row'
},
  seperate : { 
    borderWidth:2, 
    marginLeft:'2%', 
    height:'85%', 
    alignSelf:'center'
},
});

