import React, { useState } from 'react';
import { View, Text, Image, Dimensions, Animated } from 'react-native';
import { withAnchorPoint } from 'react-native-anchor-point';

const Speedometer = ({speed,rpm}) => {
  const scale = speed %186 ;
  const getTransform = () => {
    let transform = {
        transform: [{ perspective: 400 }, { rotate: `${scale  - 90}deg` }],
    };
    return withAnchorPoint(transform, { x: 0.5, y: 0.8 }, { width: 150, height: 150 });
};
  return (
        <View style={{alignSelf: 'center', justifyContent: 'center', alignItems: 'center',}} >
            <Image
                source={require('../../assets/img/speedometer.png')}
                style={{ height: Dimensions.get('window').height/5,aspectRatio:1*1.6 }}
            />
            <View style={{position:'absolute',flexDirection:'row', fontSize:15,color:'#fff',bottom:'15%',right:'14%'}}>
                <Text style={{fontSize:15,color:'#fff',alignSelf:'flex-end'}}>{speed} </Text>
                <Text style={{fontSize:13,color:'#fff',alignSelf:'flex-end'}}>km/h</Text>
            </View>
            <View style={{position:'absolute',flexDirection:'row', fontSize:15,color:'#fff',bottom:'15%',left:'14%'}}>
                <Text style={{fontSize:14,color:'#fff',alignSelf:'flex-end'}}>{rpm} </Text>
                <Text style={{fontSize:12,color:'#fff',alignSelf:'flex-end'}}>rpm</Text>
            </View>
            <View
                style={{
                position: 'absolute',
                alignItems:'center',
                alignSelf:'center',
                justifyContent:'center',
                bottom:'2%',
                }}
            >
                <Animated.Image
                source={require('../../assets/img/needle-red.png')}
                resizeMode='cover'
                resizeMethod={'scale'}
                style={[{ 
                    width: Dimensions.get('window').width/14 , 
                    height: Dimensions.get('window').height/5-Dimensions.get('window').height/30,
                    }
                    ,getTransform()]}
                />
            </View>
            <Text style={{bottom:-10}} ></Text>
        </View>
  );
};

export default Speedometer;