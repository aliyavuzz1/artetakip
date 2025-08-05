import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  View,
  FlatList,
  Pressable
} from 'react-native';
import {Button, Header,LinearProgress,Text} from 'react-native-elements';
import {navigationRef} from '../navigation/navigationRef';
import {observer} from 'mobx-react';
import sellerStore from '../store/sellerStore';
import userStore from '../store/userStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import NotificationComponent from '../components/notificationComponent';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';
import sellerInfo from '../../assets/sellerUI/sellerInfo';

const NotificationScreen = observer(() => {
  
  const renderItem = ({ item }) => (
    <NotificationComponent item={item} />
  );

  return (
    <View style={styles.container}>
        <Header
            backgroundColor={sellerUI.color3}
            leftComponent={
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    navigationRef.dispatch(DrawerActions.openDrawer())
                  }}>
                  <Ionicons name="menu" color={sellerUI.color4} size={26} />
                </TouchableOpacity>
              </View>
            }
            centerComponent={
              <View style={{alignItems:'center', justifyContent:'center'}}>
                <Text h4 h4Style={{fontSize:21, alignSelf:'center', fontWeight:'700',marginTop:3, color:sellerUI.color4}} >{sellerInfo.companyName}</Text>
              </View>
            }
          />

        <LinearProgress style={{width:'100%', alignSelf:'center',marginTop:10,display:userStore.notificationIndicator ? 'flex' : 'none' }} color='red'/>
        <FlatList
          data={userStore.notifications}
          renderItem={renderItem}
          initialNumToRender={7}
          keyExtractor={(item, index) => String(index)}
          scrollIndicatorInsets={{ right: 1 }}
        />
    </View>
  );
});
export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
