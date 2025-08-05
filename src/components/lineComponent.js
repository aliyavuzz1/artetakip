import React from 'react';
import { TouchableOpacity ,View, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const Line = ({data, textColor}) => (
    <View
      style={styles.item}>
      <Text
        style={{fontSize: 14,fontWeight:'600', flex:2, textAlign: 'left',color:'#000'}}>
        {data.PLAKA}
      </Text>
      <Text allowFontScaling={false} style={{flex:1,textAlign:'center',color:'#000'}}>{data.ACTIVATION_START}</Text>
      <Text allowFontScaling={false} style={{flex:1,textAlign:'center',color:'#000'}}>{data.ACTIVATION_END}</Text>
    </View>
  );

export const Line2 = ({title , data}) => {
  return(
  <View
      style={styles.item}>
      <Text
        style={{fontSize: 14,fontWeight:'600', flex:1, textAlign: 'left',color:'#000'}}>
        {title}
      </Text>
      <Text style={{flex:3,textAlign:'right',color:'#000'}}>{data}</Text>
    </View>
    )
}  


export const CanbusLine = ({title, data, icon, filled,content}) => {
  return(
  <View
      style={[styles.item,{borderWidth: filled ? 1 : 0.5, borderColor: filled ? 'green' : 'red'}]}>
      <FontAwesome name={icon} size={20} style={{flex:0.6}}  color='gray'/>
      <Text
        style={{fontSize: 14,fontWeight:'600', flex:5, textAlign: 'left',color:'#000'}}>
        {title}
      </Text>
      <Text style={{flex:2,textAlign:'right',color:'#000'}}>{data} {content}</Text>
    </View>
    )
}  

const styles = StyleSheet.create({
    item: {
      margin: 2,
      marginHorizontal:5,
      padding: 10,
      borderRadius: 4,
      alignItems: 'center',
      borderWidth:0.2,
      backgroundColor:'#FFFFFF',
      flexDirection: 'row', 
      justifyContent: 'space-between'
    },
  });
  