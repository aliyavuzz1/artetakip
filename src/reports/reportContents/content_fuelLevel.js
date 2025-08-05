import * as React from 'react';
import {Alert, Button, Platform, View} from 'react-native';
import {ScrollView, StyleSheet, TouchableOpacity,SafeAreaView} from 'react-native';
import {DataTable, Provider} from 'react-native-paper';
import {Text, Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';
import {inject, observer} from 'mobx-react';
import { TableRow } from '../../components/tableRow';
import { PermissionsAndroid } from 'react-native';
import { activityDetailtoExcel } from '../../services/reportServices/activityDetailService';
import { i18n } from '../../localization';
import sellerUI from '../../../assets/sellerUI/sellerUI';

const Content_FuelLevel = observer( () => {
  let title = reportStore.reportPlate;
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
  return (
    <>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigationRef.goBack();
              }}>
              <Icon name="return-up-back" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={{text: title, style: styles.heading}}
      />
    </>
  );
});

export default Content_FuelLevel;

const styles = StyleSheet.create({
  datePicker: {
    borderWidth: 0.6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'justify',
    margin: 2,
    color:sellerUI.color4
  },
  subHeading:{
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'justify',
    color:sellerUI.color4
  },
  headerRight:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:'10%',
    color:sellerUI.color4
  }
});
