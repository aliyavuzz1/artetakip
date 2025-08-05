import React from 'react';
import { DataTable } from 'react-native-paper';
//import { Text } from 'react-native-elements';
import { View,Text,TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { i18n } from '../localization';
import userStore from '../store/userStore';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import getCarsMap from '../services/mapService';
import carListStore from '../store/carListStore';
import { navigationRef } from '../navigation/navigationRef';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommutyIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
const iconCreator = (alarmID) => {
 switch (alarmID) {
    case '203':
      return(
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
              <Ionicons name='ios-speedometer'  size={25} color='#fff'/>
          </View>
      )
    case '204':
      return(
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
              <MaterialCommutyIcons name='car-brake-abs'  size={25} color='#fff'/>
          </View>
      )
    case '105':
      return(
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
              <MaterialCommutyIcons name='car-speed-limiter'  size={25} color='#fff'/>
          </View>
      )
    case '150':
      return(
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
              <Feather name='corner-left-up'  size={25} color='#fff'/>
          </View>
      );
    case '151':
      return(
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
              <Feather name='corner-right-up'  size={25} color='#fff'/>
          </View>
      )
    default:
      return (
        <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
            <Ionicons name='warning'  size={25} color='#fff'/>
        </View>
      );
 }
}
export const SummaryLinesWithIcons = ({params,index,icon}) => {
    return(
    <TouchableOpacity onPress={async()=>{
        console.log(params.ID);
        await getCarsMap(params.ID);
        carListStore.setCarReplayID(params.ID);
        navigationRef.navigate('CarsMap1',{cameFrom:'SummaryPage'});
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 4, borderRadius: 10, marginTop: 4,width:'95%',alignSelf:'flex-end' }} >
        <View style={{ flexDirection: 'row' }} >
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
            {icon ? iconCreator(pa) : <Text style={{fontSize:23, color:'#fff'}}>{index}.</Text>}
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', alignSelf: 'center', marginLeft: 5 }} >{params.PLAKA}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ alignSelf: 'center', color: 'gray', fontSize: 14,maxWidth:'80%',marginRight:6 }}>{params.fark} km</Text>
          <FontAwesome color={'gray'} name= {'angle-right'} size={22} style={{marginRight:5}} />
        </View>
      </View>
    </TouchableOpacity>
    )
}
export const AlarmLinesWithIcons = ({params}) => {
    console.log(params);
    return(
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: 4, borderRadius: 10, marginTop: 4,width:'95%',alignSelf:'flex-end' }} >
        <View style={{ flexDirection: 'row' }} >
          <View style={{ height: 40, width: 40, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }} >
            {iconCreator(params.alarmID)}
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', alignSelf: 'center', marginLeft: 5 }} >{params.alarmdesc}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ alignSelf: 'center', color: 'gray', fontSize: 14,maxWidth:'80%',marginRight:6 }}>{params.alarm_sayisi}</Text>
        </View>
      </View>
    </View>
    )
}