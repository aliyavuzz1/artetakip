import React, {Component} from 'react';
import {Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const createPlateIcon = (color, plate, textColor,plateWidth,speed) => {
  return (
    <>
    {color == 'green' ?<Text style={{fontSize:12,alignSelf:'center',fontWeight:'bold'}} >{speed+' km/saat'}</Text> : null}
    <View style= {{flexDirection:'row',}}>
      <View
        style={{
          padding: 3,
          backgroundColor: '#C8C6C6',
          borderWidth: 2,
          borderColor: color,
          borderRadius: 5,
          flexDirection: 'row',
          minWidth: 60,
          width:plateWidth
        }}>
        <View
          style={{
            backgroundColor: color,
            marginLeft: -3,
            marginVertical: -3,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 8,
              fontWeight: '800',
              alignSelf: 'center',
              marginTop: 8,
              padding: 3,
              color: 'white',
            }}>
            TR
          </Text>
        </View>
        <Text
          style={{
            padding: 1,
            fontWeight: '800',
            fontSize: 12,
            color: textColor,
            maxWidth:'85%',
            marginLeft:2
          }}>
          {plate}
        </Text>
      </View>
      </View>
    </>
  );
};

export default createPlateIcon;


export const createPlateIconForAllCars = (color, plate, textColor,plateWidth,speed,rotate) => {
  return (
    <>
    {color == 'green' ?<Text style={{fontSize:10,alignSelf:'center',fontWeight:'bold'}} >{speed+' km/saat'}</Text> : null}
    <View style= {{flexDirection:'row',}}>
      <View
        style={{
          padding: 1,
          backgroundColor: '#C8C6C6',
          borderWidth: 1,
          borderColor: color,
          borderRadius: 5,
          flexDirection: 'row',
          minWidth: 60,
          width:plateWidth
        }}>
        <View
          style={{
            backgroundColor: color,
            marginLeft: -3,
            marginVertical: -3,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 7,
              fontWeight: '800',
              alignSelf: 'center',
              marginTop: 8,
              padding: 2,
              color: 'white',
            }}>
            TR
          </Text>
        </View>
        <Text
          style={{
            padding: 0,
            fontWeight: '600',
            fontSize: 12,
            color: textColor,
            marginLeft:2
          }}>
          {plate}
        </Text>
      </View>
      </View>
      <MaterialIcons name={'navigation'} color={color} size={28}  style={{alignSelf:'center',marginTop:1,transform:[{rotate:rotate+'deg'}] }} /> 
    </>
  );
};