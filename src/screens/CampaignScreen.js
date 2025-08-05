import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  View,
  FlatList,
  Pressable,
  Alert,
  Share
} from 'react-native';
import {Button, Header,LinearProgress,Text} from 'react-native-elements';
import {navigationRef} from '../navigation/navigationRef';
import {observer} from 'mobx-react';
import sellerStore from '../store/sellerStore';
import userStore from '../store/userStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import NotificationComponent, { CampaignComponent } from '../components/notificationComponent';
import { i18n } from '../localization';
import sellerUI from '../../assets/sellerUI/sellerUI';

const CampaignsScreen = observer(() => {
  
  const renderItem = ({ item }) => (
    <CampaignComponent item={item} />
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
                <Text h4 h4Style={{fontSize:21, alignSelf:'center', fontWeight:'500',marginTop:3, color:sellerUI.color4}} >{i18n.t('campaigns')}</Text>
              </View>
            }
          />
        <FlatList
          data={userStore.campaign.campaign}
          renderItem={renderItem}
          initialNumToRender={7}
          keyExtractor={(item, index) => String(index)}
          scrollIndicatorInsets={{ right: 1 }}
        />
    </View>
  );
});
export default CampaignsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
