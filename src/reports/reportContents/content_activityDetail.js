import * as React from 'react';
import {useState} from 'react';
import {Alert, Platform, View} from 'react-native';
import {ScrollView, StyleSheet, TouchableOpacity,SafeAreaView} from 'react-native';
import {DataTable, Provider} from 'react-native-paper';
import {Card, Button, Text, Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../../navigation/navigationRef';
import reportStore from '../../store/reportStore';
import {inject, observer} from 'mobx-react';
import carListStore from '../../store/carListStore';
import { TableRow } from '../../components/tableRow';
import XLSX from 'xlsx';
import { PermissionsAndroid } from 'react-native';
import { activityDetailtoExcel } from '../../services/reportServices/activityDetailService';
import sellerStore from '../../store/sellerStore';
import { i18n } from '../../localization';
import sellerUI from '../../../assets/sellerUI/sellerUI';

var RNFS = require('react-native-fs');

  // function to handle exporting
  const exportDataToExcel = () => {

    // Created Sample data
    let activityDetail_excel = reportStore.excelVariant;

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(activityDetail_excel) 
    XLSX.utils.book_append_sheet(wb,ws,"Users")
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});

    // Write generated excel to Storage
    RNFS.writeFile(RNFS.DocumentDirectoryPath + 'aktivite-detay.xlsx', wbout, 'ascii').then((r)=>{
     Alert.alert(
      i18n.t('success_pathOfFile'),
      RNFS.DocumentDirectoryPath,
      [{text: i18n.t('ok')}],
      {cancelable: false},
    );
     console.log('success');
    }).catch((e)=>{
      console.log('Error', e);
    });
  }
  const handleClick = async () => {
    activityDetailtoExcel(reportStore.carActDetail);
    if (!Platform.OS){
      try{
        // Check for Permission (check if permission is already given or not)
        let isPermitedExternalStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  
        if(!isPermitedExternalStorage){
          // Ask for permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Permission Granted (calling our exportDataToExcel function)
            exportDataToExcel();
            console.log("Permission granted");
          } else {
            // Permission denied
            console.log("Permission denied");
            Alert.alert(
              'Hata',
              'İzin reddedildi.',
              [{text: 'TAMAM'}],
              {cancelable: false}
              );
          }
        }else{
           // Already have Permission (calling our exportDataToExcel function)
           exportDataToExcel();
        }
      }catch(e){
        console.log('Error while checking permission');
        console.log(e);
        return
      }
    }else{
      exportDataToExcel();
    }
  };

  const numberOfItemsPerPageList = [3, 5, 10, 50];

const Content_ActivityDetail = observer( route => {
  
  let totalIndex = reportStore.totalIndex;

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, totalIndex);


  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);
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
                navigationRef.goBack();
              }}>
              <Icon name="return-up-back" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={
          <View>
            <Text style={styles.heading}>{title}</Text>
            <Text style={styles.subHeading}>{i18n.t('total')} {reportStore.totalIndex} {i18n.t('line')}</Text>
          </View>
          }
        rightComponent= {
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => {
                handleClick();
              }}>
              <Icon name="download" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
      />
      <ScrollView horizontal>
        <SafeAreaView>
        <Provider>
          <DataTable>
            <DataTable.Header>
              <View
                style={{width: 100,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray'}} >
                  {i18n.t('date')} 
                </Text>
              </View>
              <View style={{borderWidth:0.2, backgroundColor:'black', marginRight:3}}></View>
              <View
                style={{width: 100,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray',textAlign:'center'}} >
                  {i18n.t('ignition')}
                </Text>
              </View>
              <View style={{borderWidth:0.2, backgroundColor:'black', marginRight:3}}></View>
              <View
                style={{width: 100,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray',textAlign:'center'}} >
                  {i18n.t('speed')} 
                </Text>
              </View>
              <View style={{borderWidth:0.2, backgroundColor:'black', marginRight:3}}></View>
              <View
                style={{width: 100,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray',textAlign:'center'}} >
                  {i18n.t('distance')} 
                </Text>
              </View>
              <View style={{borderWidth:0.2, backgroundColor:'black', marginRight:3}}></View>
              <View
                style={{width: 100,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray',textAlign:'center'}} >
                  {i18n.t('alarm')} 
                </Text>
              </View>
              <View style={{borderWidth:0.2, backgroundColor:'black', marginRight:3}}></View>
              <View
                style={{width: 190,justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 16, color:'gray',textAlign:'center'}} >
                  {i18n.t('address')} 
                </Text>
              </View>
            </DataTable.Header>
            <ScrollView>
              {
                reportStore.carActDetail
                .slice(
                    page * numberOfItemsPerPage,
                    page * numberOfItemsPerPage + numberOfItemsPerPage
                  )
                  .map((element, index)=>{
                  return(
                    <React.Fragment key={index}>
                      <TableRow 
                          date = {element.TA}
                          alarm = {element.AL}
                          kontak = {element.ST}
                          speed = {element.SP}
                          mesafe = {element.DS}
                          adress = {element.AD}
                        />
                        <View
                          style={{
                            borderWidth: 0.3,
                            borderColor: 'gray',
                            height: '0%',
                            width: '100%',
                          }}
                        />
                    </React.Fragment>
                  )
                })
              }
              <DataTable.Pagination
                  style={{alignSelf:'flex-start',marginBottom:350,marginLeft:-25}}
                  page={page}
                  numberOfPages={Math.ceil(totalIndex / numberOfItemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${totalIndex} >> ${from + 1}-${to}`}
                  showFastPaginationControls
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={numberOfItemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                />
              </ScrollView>
          </DataTable>
          </Provider>
        </SafeAreaView>
      </ScrollView>
    </>
  );
});

export default Content_ActivityDetail;

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
