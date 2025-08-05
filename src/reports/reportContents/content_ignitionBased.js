import * as React from 'react';
import {useState} from 'react';
import {FlatList, View} from 'react-native';
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
import IgnitionTableRow from '../../components/ignitionTableRow';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import IgnitionReport from '../journeyReports/rp_ignitionBased';
const optionsPerPage = [2, 3, 4];


const Content_IgnitionReport = observer(props => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  
  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  let title = reportStore.reportPlate;

  const renderIgnitionRow = (data) => {
    return(
      <IgnitionTableRow  data={data ? data : null} />
    )
  }
  const navigation = useNavigation();

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
                navigation.navigate("DrawerRoot", {
                  screen: "IgnitionReport",
                });
                
            
              }}>
                

              <Icon name="return-up-back" color={sellerUI.color4} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={{text: title, style: styles.heading}}
      />
      <FlatList
        data={reportStore.ignitionReport}
        renderItem={renderIgnitionRow}
        initialNumToRender={7}
      />
    </>
  );
});

export default Content_IgnitionReport;

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
