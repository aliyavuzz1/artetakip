import moment from "moment";
import React from "react"
import { View ,Text , StyleSheet} from "react-native"

const IgnitionTableRow = (params) => {
    let data = params.data.item;
    return(
        <View style={styles.container}>
            <View style={{backgroundColor:'#EEEEEE',alignItems:'center',borderRadius:5,flex:1,margin:3,paddingVertical:5}} >
                <Text allowFontScaling={false} style={{fontSize:12}}>{moment(data.TA).format('HH:mm')}</Text>
                <Text allowFontScaling={false} style={{fontSize:11}}>{moment(data.TA).format('DD MMMM')}</Text>
            </View>
            <View style={{flex:0.8,alignItems:'center',margin:3,justifyContent:'center'}}>
                <View style={{width:13,height:13,backgroundColor:data.IG == 1 ? 'green' : 'red',borderRadius: 10}}/>
                <Text style={{fontSize:11,color:data.IG == 1 ? 'green' : 'red'}} >{data.IG == 1 ? 'Açık' : 'Kapalı'}</Text>
            </View>
            <View style={{flex:5,margin:3,padding:2,justifyContent:'center'}}>
                <Text allowFontScaling={false} style={{fontSize:12,fontWeight:'500'}}>{data.AD ? data.AD : 'Adres bilgisi yok.'}</Text>
            </View>
        </View>
    )
}

export default IgnitionTableRow;

const styles = StyleSheet.create({
    container: {
        width:'100%',
        backgroundColor:'#FFFFFF',
        flexDirection:'row',
        borderWidth:0.2,
        padding:4
    }
})