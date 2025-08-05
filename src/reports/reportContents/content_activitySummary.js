import * as React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Card, Button, Text, Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';
import {inject, observer} from 'mobx-react';
import carListStore from '../../store/carListStore';
import { TableRow } from '../../components/tableRow';
import sellerStore from '../../store/sellerStore';
import { i18n } from '../../localization';
import sellerUI from '../../../assets/sellerUI/sellerUI';

const optionsPerPage = [2, 3, 4];

const Content_ActivitySummary = observer(props => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  let title = reportStore.reportPlate;
  return (
    <>
      <Header
        backgroundColor={sellerUI.color3}
        leftComponent={
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                reportStore.setAdress1('');
                reportStore.setAdress2('');
                reportStore.setLAT1(0);
                reportStore.setLAT2(0);
                reportStore.setLNG1(0);
                reportStore.setLNG2(0);
                reportStore.setFark();
                navigationRef.goBack();
              }}>
              <Icon name="return-up-back" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={{text: i18n.t('plate') + ': '+ title, style: styles.heading}}
      />
      <ScrollView horizontal>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                style={{width: 150}}
                textStyle={{fontWeight: 'bold', fontSize: 16}}>
                {i18n.t('totalKilometer')}
              </DataTable.Title>
              <DataTable.Title
                style={{width: 170}}
                textStyle={{fontWeight: 'bold', fontSize: 16}}>
                {i18n.t('firstPosition')}
              </DataTable.Title>
              <DataTable.Title
                style={{width: 170}}
                textStyle={{fontWeight: 'bold', fontSize: 16}}>
                {i18n.t('lastPosition')}{' '}
              </DataTable.Title>
            </DataTable.Header>
            <DataTable.Row>
            <View style={{width: 150,justifyContent:'center'}}>
              <Text style={{fontSize:13,maxWidth:'90%'}} allowFontScaling={false} numberOfLines={3}>
                {reportStore.fark}
              </Text>
            </View>
            <View style={{width: 170,justifyContent:'center'}}>
              <Text style={{fontSize:13,maxWidth:'90%'}} allowFontScaling={false} numberOfLines={3}>
                {reportStore.adress1}
              </Text>
            </View>
            <View style={{width: 170,justifyContent:'center'}}>
              <Text style={{fontSize:13,maxWidth:'90%'}} allowFontScaling={false} numberOfLines={3}>
                {reportStore.adress2}
              </Text>
            </View>
            </DataTable.Row>
          </DataTable>
          <View
            style={{
              borderWidth: 0.4,
              borderColor: 'gray',
              height: '0%',
              width: '100%',
            }}
          />
        </View>
      </ScrollView>
    </>
  );
});

export default Content_ActivitySummary;

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
});
