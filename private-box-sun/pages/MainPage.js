import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl, Platform, LogBox, } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { firebase_db } from "../firebaseConfig"
import Loading from "../components/Loading";
import Upload from '../components/Upload';
import Card from '../components/Card';
import CardVideo from '../components/CardVideo';
import CardDocument from '../components/CardDocument';
import * as Application from 'expo-application';
const isIOS = Platform.OS === 'ios'
import {
    setTestDeviceIDAsync,
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded
} from 'expo-ads-admob';

export default function MainPage({ navigation, route }) {
    const [ready, setReady] = useState(true);
    const [showModal, setShowModal] = useState();
    const [state, setState] = useState('All Files');
    const [cardState, setCardState] = useState([]);
    const [videoState, setVideoState] = useState([]);
    const [docState, setDocState] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false)
            feedUpdate();
        });

    }, []);
    let userUniqueId; // 안드로이드 or IOS userID 를 담을 변수
    const getUserId = async () => {
        if (isIOS) {
            let iosId = await Application.getIosIdForVendorAsync();
            userUniqueId = iosId
        } else {
            userUniqueId = await Application.androidId
        }
    }
    const feedUpdate = () => {
        firebase_db.ref(`user/${userUniqueId}/images/`).once('value').then(snapshot => {
            let resultImage = snapshot.val();
            console.log(resultImage)
            if (resultImage != null) {
                setCardState(resultImage)
            }
            else {
                setCardState([]);
            }
        })
        firebase_db.ref(`user/${userUniqueId}/video/`).once('value').then(snapshot => {
            let resultVideo = snapshot.val();
            console.log(resultVideo)
            if (resultVideo != null) {
                setVideoState(resultVideo)
            }
            else {
                setVideoState([]);
            }
        })
        firebase_db.ref(`user/${userUniqueId}/documents/`).once('value').then(snapshot => {
            let resultDoc = snapshot.val();
            console.log(resultDoc)
            if (resultDoc != null) {
                setDocState(resultDoc)
            }
            else {
                setDocState([]);
            }
        })
    }

    useEffect(() => {
        navigation.setOptions({
            title: 'PRIVATE BOX',
            headerRight: () => (
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.btnicon} onPress={() => setShowModal(true)}>
                        <Icon2 name='plus' size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            ),
        })
        getUserId();
        LogBox.ignoreLogs(['Setting a timer for a long period of time'])
        setTimeout(() => {
            feedUpdate()
            setReady(false)
        }, 2000)

    }, [])

    return ready ? <Loading /> : (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.categories}><Text style={styles.cateText}>CATEGORIES</Text>
                <View style={styles.extension}>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => { setState('image') }}><Icon name="images" size={20} color="#000" /><Text style={styles.uploadText}>Images</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => { setState('video') }}><Icon name="video" size={20} color="#000" /><Text style={styles.uploadText}>Video</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => { setState('Documents') }}><Icon2 name="filetext1" size={20} color="#000" /><Text style={styles.uploadText}>Documents</Text></TouchableOpacity>
                </View>
                <View style={styles.extension}>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => { setState('Favorites') }}><Icon name="star" size={20} color="#000" /><Text style={styles.uploadText}>Favorites</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => setShowModal(false)}><Icon2 name="search1" size={20} color="#000" /><Text style={styles.uploadText}>Search</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.uploadContent} onPress={() => { setState('All Files') }}><Icon2 name="arrowsalt" size={20} color="#000" /><Text style={styles.uploadText}>All Files</Text></TouchableOpacity>

                </View>
            </View>
            <StatusBar style="dark" />
            {showModal && <Upload visible={showModal} closeUpload={() => setShowModal(false)} navigation={navigation} refreshCard={() => onRefresh()} />}

            <View style={styles.cardContainer}>
                {(state === 'All Files' || state === 'image') &&
                    cardState.map((content, i) => {
                        return (<Card content={content} key={i} props={i} cardState={cardState} setCardState={setCardState} navigation={navigation} refreshCard={() => onRefresh()} />)
                    })
                }
                {(state === 'All Files' || state === 'video') &&
                    videoState.map((content, i) => {

                        return (<CardVideo content={content} key={i} props={i} videoState={videoState} setVideoState={setVideoState} navigation={navigation} refreshCard={() => onRefresh()} />)
                    })
                }
                {(state === 'All Files' || state === 'Documents') &&
                    docState.map((content, i) => {

                        return (<CardDocument content={content} key={i} props={i} docState={docState} setDocState={setDocState} navigation={navigation} refreshCard={() => onRefresh()} />)
                    })
                }
            </View>
            {Platform.OS === 'ios' ? (
                <AdMobBanner
                    bannerSize="fullBanner"
                    servePersonalizedAds={true}
                    adUnitID="ca-app-pub-7098615219534704/9349891772"
                    style={styles.banner}
                />
            ) : (
                <AdMobBanner
                    bannerSize="fullBanner"
                    servePersonalizedAds={true}
                    adUnitID="ca-app-pub-7098615219534704/9349891772"
                    style={styles.banner}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DCDCDC',
    },
    uploadView: {
        backgroundColor: "#fff",
        width: '98%',
    },
    uploadContent: {
        flexDirection: "row",
        alignSelf: 'center',
        marginLeft: 15,
        width: '22%',
        marginHorizontal: 30,
    },
    uploadText: {
        color: '#000',
        marginLeft: 7,
    },
    extension: {
        flex: 1,
        flexDirection: 'row',
        height: 40,
        marginVertical: 5,
        alignSelf: 'center'
    },
    btnicon: {
        marginRight: 10,
    },
    headerRight: {
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    categories: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    cateText: {
        marginVertical: 15,
        marginLeft: 20,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#aaa'
    },
    closeModal: {
        alignItems: 'flex-end',
        marginRight: 20,
    },
    cardContainer: {
        paddingVertical: 10,
    },
    banner: {
        width: "100%",
        height: 100,
    }
});

