import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Pressable, Text} from 'react-native';
import { navigationRef } from '../navigation/navigationRef';
import getCarsMap from '../services/mapService';
import carListStore from '../store/carListStore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react';
import moment from 'moment';
  
const CarListv4 = observer((props) => {
  const data = props.data;
  const color = props.color;
  const index = props.index;
      return (
      <Pressable
        style={{marginVertical:0}}
        onPress={async () => {
            //console.log(id);
            await getCarsMap(data.ID);
            carListStore.setCarReplayID(data.ID);
            navigationRef.navigate('CarsMap1',{cameFrom:'HomeScreen'});
        }}
       >
        <View style={[styles.item,{ backgroundColor: (index%2 == 0) ? '#EFEFEFEF' : 'DDDDDD' }]}>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <View style={{marginLeft:'2%',backgroundColor:color,width:20,height:20,borderRadius:15}}/>
                <Text allowFontScaling={false} style={{fontSize:13,fontWeight:'700',maxWidth:'80%',marginLeft:'5%',color:'#000000'}} >{data.P}</Text>
            </View>
            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                <Text allowFontScaling={false} style={{fontSize:13,textAlign:'center',maxWidth:'95%',letterSpacing:-0.2,color:'#000000'}} >{data.LK}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',flexDirection:'row'}}>
                <View style={{flex:5,justifyContent:'center',alignItems:'flex-end'}}>
                  <Text allowFontScaling={false} style={{textAlign:'center',fontSize:11,fontWeight:'800',letterSpacing:-0.3,color:'#000000'}}>{moment(data.KT).format('DD-MM-YYYY HH:mm:ss')}</Text>
                  <Text allowFontScaling={false} style={{textAlign:'center',fontSize:12,color:'#000000'}}>{data.SP} Km/Saat</Text>
                  <Text allowFontScaling={false} style={{textAlign:'center',fontSize:12,color:'#000000'}}>{data.DD} km</Text>
                </View>
                <MaterialIcons name='keyboard-arrow-right' size={32} color={'#B2B2B2'} style={{alignSelf:'center',flex:1,textAlign:'center',}}/>
            </View>
        </View>
      </Pressable>
      );
    });
;


export default CarListv4;


const styles = StyleSheet.create({
  item: {
    marginLeft:1,
    marginRight:1, 
    aspectRatio:1*5,
    flexDirection:'row'
},
  seperate : { 
    borderWidth:2, 
    marginLeft:'2%', 
    height:'85%', 
    alignSelf:'center'
},
});

