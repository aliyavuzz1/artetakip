import React, {Component} from 'react';
import {Text, View,Image, TouchableOpacity, Linking} from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const NotificationComponent = ({item}) => (
    <View style = {{backgroundColor:'white',padding:10,marginVertical:5, borderRadius:7}}>
        {console.log(item)}
        <View style={{flexDirection:'row', margin:10}} >
            <View style={{backgroundColor:'gray',justifyContent:'center',width:50,height:50,alignSelf:'center',borderRadius:25}} >
                <FontAwesome name='bell' size={23} color='white' style={{alignSelf:'center'}} />
            </View>
            <View style={{height:'100%', borderWidth:1, alignSelf:'center', marginHorizontal:6,}} />
            <Text style= {{textAlign:'center', fontSize:14, color:'black',textAlignVertical:'center', fontWeight:'500',maxWidth:'80%'}}>{item.message}</Text>
        </View>
        <Text style= {{textAlign:'right', fontSize:14, color:'black',fontWeight:'500', fontStyle:'italic'}}>{item.addedDate}</Text>
    </View>
  )

export default NotificationComponent;

export const CampaignComponent = ({item}) => (
    <TouchableOpacity disabled={item.url ? false : true} onPress={()=>{Linking.openURL('http'+item.url)}} style = {{backgroundColor:'#fff',padding:10,marginVertical:5, borderRadius:7,}}>
        {console.log(item)}
        <View style={{flexDirection:'row', margin:0}}>
            <Avatar source={{uri:item.img}} size={'large'} containerStyle={{alignSelf:'center'}}/>
            <View style={{height:'100%', borderWidth:1, alignSelf:'center', marginHorizontal:6,}}/>
            <View>
                <Text allowFontScaling={false} style= {{textAlign:'center', fontSize:14, color:'black',textAlignVertical:'center', fontWeight:'600',maxWidth:'87%'}}>{item.title}</Text>
                <Text allowFontScaling={false} style= {{textAlign:'center', fontSize:12, color:'black',textAlignVertical:'center', fontWeight:'400',maxWidth:'87%'}}>{item.content}</Text>
            </View>
        </View>
        <Text style= {{textAlign:'right', fontSize:14, color:'black',fontWeight:'500', fontStyle:'italic'}}>{item.addedDate}</Text>
    </TouchableOpacity>
  )
