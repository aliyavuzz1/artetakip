import * as React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {DataTable} from 'react-native-paper';
import {Card, Button, Text, Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {navigationRef} from '../../navigation/navigationRef';
import sellerStore from '../../store/sellerStore';
import sellerUI from '../../../assets/sellerUI/sellerUI';
const optionsPerPage = [2, 3, 4];

const Content_FuelGraph = () => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

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
              <Icon name="return-up-back" color={sellerUI.color2} size={26} />
            </TouchableOpacity>
          </View>
        }
        centerComponent={{text: 'Toplam Yakıt Tüketimi', style: styles.heading}}
      />
      <ScrollView horizontal>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                style={{width: 100}}
                textStyle={{fontWeight: 'bold', fontSize: 16}}>
                Plaka
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Tarih
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Araç KM
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Top. Yakıt
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Yakıt
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Adres
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Hız
              </DataTable.Title>
              <DataTable.Title
                numeric
                style={{width: 100}}
                textStyle={{fontWeight: '200', fontSize: 16}}>
                Devir
              </DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell style={{width: 100}}>34 BSH 245</DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                01/09/2022
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                1000000
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                566 lt
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                120 lt
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                köşklüçeşme mah 12 sok no 5 d 19
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                120
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                237
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell style={{width: 100}}>34 AS 4245</DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                159
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                6.0
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                237
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                123
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                159
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                6.0
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                237
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Row>
              <DataTable.Cell style={{width: 100}}>
                Frozen yogurt
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                159
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                6.0
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                237
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                123
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                159
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                6.0
              </DataTable.Cell>
              <DataTable.Cell numeric style={{width: 100}}>
                237
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>8.0</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>8.0</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
              <DataTable.Cell numeric>237</DataTable.Cell>
              <DataTable.Cell numeric>8.0</DataTable.Cell>
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
};

export default Content_FuelGraph;

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
    color:'black'
  },
});
