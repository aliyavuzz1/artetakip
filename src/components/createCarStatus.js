import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {View, Text} from 'react-native';
import { i18n } from '../localization';

const createCarStatus = (status) => {
    if (status == 'black') {
        return(
            <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'space-between'}}>
                <Text style = {{color:'#393E46'}}>{i18n.t('passive')}</Text>
                <MaterialIcons name='toggle-off' color={'#333333'} size={28}/>
            </View>
        )
    } else if (status == 'danger'){
        return(
            <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'space-between'}}>
                <Text style = {{color:'#393E46'}}>{i18n.t('standing')}</Text>
                <MaterialIcons name='toggle-off' color={'#CC3636'} size={28}/>
            </View>
        )
    }else if (status == 'warning'){
        return(
            <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'space-between'}}>
                <Text style = {{color:'#393E46'}}>{i18n.t('idling')}</Text>
                <MaterialIcons name='toggle-on' color={'#FEC260'} size={28}/>
            </View>
        )
    }else {
        return(
            <View style={{flexDirection:'row', alignItems:'center', flex:1,justifyContent:'space-between'}}>
                <Text style = {{color:'#393E46'}}>{i18n.t('moving')}</Text>
                <MaterialIcons name='toggle-on' color={'#3CCF4E'} size={28}/>
            </View>
        )
    };
  };

  export default createCarStatus;