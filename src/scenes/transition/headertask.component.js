import React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Divider,
  List,
  ListItem,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme,
  Card,
  Spinner, Button, Layout, Avatar
} from '@ui-kitten/components';
import moment from 'moment'
import { ArrowIosBackIcon, ArrowIosForwardIcon, AttachIcon, ArrowIosBackDarkthemeIcon } from '../../components/icons.js';
import { SafeAreaLayout } from '../../components/safe-area-layout.component.js';
import { xt, getDataStorage, setDataStorage } from '../../components/service.js'
import { NoRows, LoadingRows } from '../../components/main-layout';

export const HeadertaskScreen = ({ route, navigation }) => {

  const theme = useTheme();
  const [lang, setLang] = React.useState({});
  const [dataServer, setDataServer] = React.useState(route.params.site);
  const [datasite, setDatasite] = React.useState([]);
  const [emty, setEmty] = React.useState(false);
  const [dataloadding, setDataloadding] = React.useState(true);
  const [themes, setthemes] = React.useState("")

  const getDate = (date) => {
    return (date) ? moment(date).format('DD/MM/YYYY') : '';
  };



  const onHeaderTasks = async () => {
    setDataloadding(true);
    let wbs_number = xt.getWbs(route.params.wbs_id);
    let formData = new FormData();
    formData.append("pre_event", route.params.pre_event);
    formData.append("plan_code", route.params.plan_code);
    formData.append("taskid", route.params.taskid);
    formData.append("wbsid_number", wbs_number.string);

    let url = "Planning/Plan/onloadHeaderTasks";
    let rsp = await xt.postServerForm(url, formData).then(res => {
      console.log("res.data headertask: ", res.data);
      const arr = res.data;
      console.log(res.data);
      if (res.data.length == 0) {
        setEmty(true);
      } else {

        if (arr.length == 0) {
          setEmty(true);
        } else {
          setEmty(false);
          setDatasite(arr);
        }
      }

    });
  };



  const renderBackAction = () => (
    <TopNavigationAction
      icon={(themes == 'light') ? ArrowIosBackIcon : ArrowIosBackDarkthemeIcon}
      onPress={navigation.goBack}
    />
  );



  const renderFriendItem = (info) => (
    <View style={styles.friendItem}>
      <Avatar style={{ borderColor: '#2fb344', borderWidth: 1 }} source={xt.getimg(dataServer, false, info.item.img)} />
    </View>
  );
  const renderItem = (info) => (
    <Card
      style={styles.item}>
      <View style={styles.itemCenter}>
        <View style={styles.itemAuthoringContainer}>

          <Text
            style={{ width: '80%' }}
            category='p1'>
            <Text category='s1' status='basic'>{info.item.wbs_id} :</Text> {info.item.taskname}
          </Text>
          {(info.item.hasChild == 0 && !xt.isEmpty(info.item.other_wbs))
            ? <View style={{ marginVertical: 9 }}><Text
              style={{ width: '80%', }}
              category='p1'>
              <Text category='s1' status='basic' >Task Name (Other) :</Text> {info.item.other_wbs}
            </Text>
            </View>
            : null
          }
        </View>
        <View style={styles.status}>

        </View>
      </View>
      <View style={styles.itemFooter}>
        <View style={styles.itemAuthoringContainer}>
          <List
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            contentContainerStyle={styles.friendsList}
            horizontal={true}
            data={info.item.ow_list}
            renderItem={renderFriendItem}
          />
        </View>
        <View style={styles.enddate}>
          <Text
            category='p2'>
            {lang.start_date}
          </Text>
          <Text
            category='c1'>
            {getDate(info.item.start_date)}
          </Text>
        </View>
        <View style={styles.enddate}>
          <Text
            category='p2'>
            {lang.duration}
          </Text>
          <Text
            category='c1'>
            10 {lang.day}
          </Text>
        </View>
        <View style={styles.startdate}>
          <Text
            category='p2'>
            {lang.emd_date}
          </Text>
          <Text
            category='c1'>
            {getDate(info.item.end_date)}
          </Text>
        </View>
      </View>
    </Card>
  );
  const getLangDF = async () => {
    let lang_ = await xt.getLang();
    setLang(lang_);

    let themes_key = await getDataStorage("themes_ppn") || "light";
    setthemes(themes_key)
  }
  useFocusEffect(
    React.useCallback(() => {
      getLangDF();
      onHeaderTasks()
    }, [])
  );
  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        alignment='center'
        title={lang.headdertask}
        accessoryLeft={renderBackAction}
      />

      {emty == false ? (
        <List
          contentContainerStyle={styles.listContent}
          data={datasite}
          renderItem={renderItem}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {dataloadding == false ? (
            <NoRows {...lang} />
          ) : (
            <LoadingRows {...lang} />
          )}
        </View>
      )}
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    paddingHorizontal: 8,
  },
  headerDivider: {
    marginVertical: 8,
  },
  listContent: {
    padding: 8,
  },
  item: {
    marginVertical: 2,
  },
  itemHeader: {
    height: 170,
  },
  itemTitle: {
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  itemDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  itemDescription: {
    marginHorizontal: 16,
  },
  itemCenter: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginTop: 0
  },
  itemFooter: {
    flexDirection: 'row',
    marginHorizontal: -18,
    marginTop: 5
  },
  iconButton: {
    paddingHorizontal: 0,
  },
  itemAuthoringContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 0
  },
  status: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enddate: {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startdate: {
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxstatus: {
    flexDirection: 'row',
  },
  cardOptionsButton: {
    position: "absolute",
    right: -16,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: 70,
  },
  friendItem: {
    alignItems: 'center',
    marginHorizontal: 0,
  },
  friendName: {
    marginTop: 8,
  },
  friendsList: {
    marginHorizontal: 8,
    width: '50%',
  },
  complete: {
    marginRight: -10,
    padding: 1,
    backgroundColor: '#2fb344',
    borderRadius: 5,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notstart: {
    marginRight: -10,
    padding: 1,
    backgroundColor: '#a3a4a6',
    borderRadius: 5,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inprogress: {
    marginRight: -10,
    padding: 1,
    backgroundColor: '#4299e1',
    borderRadius: 5,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overdue: {
    marginRight: -10,
    padding: 1,
    backgroundColor: '#d63939',
    borderRadius: 5,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delay: {
    marginRight: -10,
    padding: 1,
    backgroundColor: '#f76707',
    borderRadius: 5,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statussort: {
    paddingTop: 10,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  // statussort_atv:{
  //   paddingTop:10,
  //   height:30,
  //   backgroundColor: 'rgba(0, 0, 0, 0)',
  // },
  statussort_x: {
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 5,
    minWidth: 95,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statussort_atv: {
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 0,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 5,
    minWidth: 95,
    backgroundColor: '#2fb344',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    margin: 2,
  },
  statusDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    minHeight: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0
  },
  icon: {
    width: 32,
    height: 32,
  },
});