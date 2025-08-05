import React from 'react';
import { DataTable } from 'react-native-paper';
import { Text } from 'react-native-elements';
import { View } from 'react-native';
export const TableRow = (params) => {
    return(
    <DataTable.Row style={{marginVertical:7}} >
        <View style={{width: 100,justifyContent:'center'}}>
          <Text numberOfLines={3}>
            {params.date}
          </Text>
        </View>
        <View style={{width: 100,justifyContent:'center'}}>
          <Text numberOfLines={3} style={{textAlign:'center'}} >
            {params.kontak}
          </Text>
        </View>
        <View style={{width: 100,justifyContent:'center'}}>
          <Text numberOfLines={3} style={{textAlign:'center'}}>
            {params.speed} km/saat
          </Text>
        </View>
        <View style={{width: 100,justifyContent:'center'}}>
          <Text numberOfLines={3} style={{textAlign:'center'}}>
            {params.mesafe} km
          </Text>
        </View>
        <View style={{width: 100,justifyContent:'center'}}>
          <Text numberOfLines={3} style={{textAlign:'center'}}>
            {params.alarm}
          </Text>
        </View>
        <View style={{width: 190,justifyContent:'center'}}>
          <Text numberOfLines={3} style={{textAlign:'center',marginLeft:10}}>
            {params.adress}
          </Text>
        </View>
    </DataTable.Row>
    )
}