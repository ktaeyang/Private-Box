import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  LogBox,
} from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Entypo";
import Icon2 from "react-native-vector-icons/AntDesign";
import * as DocumentPicker from "expo-document-picker";
import Modal from "react-native-modal";
import { firebase_db } from "../firebaseConfig";
import * as Application from "expo-application";
import AlertAsync from "react-native-alert-async";

const isIOS = Platform.OS === "ios";
export default function Upload(props) {
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  const goWrite = async () => {
    //props.navigation.navigate('WritePage') // 업데이트 예정
    Alert.alert("Private Box", "준비 중입니다.");
    //console.log(navigation)
  };
  let temp = [];
  let userUniqueId; // UserId
  let resultFile, resultVideo, resultDoc; // Doc, Image Result
  const getUserId = async () => {
    if (isIOS) {
      let iosId = await Application.getIosIdForVendorAsync();
      userUniqueId = iosId;
    } else {
      userUniqueId = await Application.androidId;
      //setUserId(userUniqueId)
    }
  };
  //#region Image Upload

  const ActionImage = async () => {
    await pickFileImage();
    const textif = await AlertAsync(
      "Private Box",
      "Do you want to upload a file?",
      [
        { text: "No", onPress: () => Promise.resolve("no") },
        { text: "Yes", onPress: () => "yes" },
      ],
      {
        cancelable: true,
        onDismiss: () => "no",
      }
    );
    if (textif === "yes") {
      ImageUpload();
      props.refreshCard();
    } else {
      props.closeUpload();
    }
  };
  const ImageUpload = async () => {
    let i = 0;
    await getUserId();

    firebase_db
      .ref(`user/${userUniqueId}/images/`)
      .once("value")
      .then((snapshot) => {
        temp = snapshot.val();
        console.log(temp);

        if (temp == null) {
          firebase_db
            .ref(`/user/${userUniqueId}/images/`)
            .child(`0`)
            .set(resultFile, function (error) {
              //console.log(error)
            });
        } else {
          while (temp[i] != undefined) {
            i++;
            if (temp[i] == undefined) {
              firebase_db
                .ref(`/user/${userUniqueId}/images/`)
                .child(`${i}`)
                .set(resultFile, function (error) {
                  //console.log(error)
                });
            }
          }
        }
      });
  };
  const pickFileImage = async () => {
    // resultImage = await ImagePicker.launchImageLibraryAsync({
    //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //     quality: 1,
    // });
    resultFile = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });

    console.log(resultFile);
  };
  //#endregion

  //#region Video Upload
  const ActionVideo = async () => {
    await pickFileVideo();
    const textif = await AlertAsync(
      "Private Box",
      "Do you want to upload a file?",
      [
        { text: "No", onPress: () => Promise.resolve("no") },
        { text: "Yes", onPress: () => "yes" },
      ],
      {
        cancelable: true,
        onDismiss: () => "no",
      }
    );
    if (textif === "yes") {
      videoUpload();
      props.refreshCard();
    } else {
      props.closeUpload();
    }
  };
  const videoUpload = async () => {
    let i = 0;
    await getUserId();

    firebase_db
      .ref(`user/${userUniqueId}/video/`)
      .once("value")
      .then((snapshot) => {
        temp = snapshot.val();
        console.log(temp);

        if (temp == null) {
          firebase_db
            .ref(`/user/${userUniqueId}/video/`)
            .child(`0`)
            .set(resultFile, function (error) {
              //console.log(error)
            });
        } else {
          while (temp[i] != undefined) {
            i++;
            if (temp[i] == undefined) {
              firebase_db
                .ref(`/user/${userUniqueId}/video/`)
                .child(`${i}`)
                .set(resultFile, function (error) {
                  //console.log(error)
                });
            }
          }
        }
      });
  };
  const pickFileVideo = async () => {
    resultFile = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });

    console.log(resultFile);
  };
  //#endregion

  //#region Document Upload
  const ActionDoc = async () => {
    await pickFileDoc();
    const textif = await AlertAsync(
      "Private Box",
      "Do you want to upload a file?",
      [
        { text: "No", onPress: () => Promise.resolve("no") },
        { text: "Yes", onPress: () => "yes" },
      ],
      {
        cancelable: true,
        onDismiss: () => "no",
      }
    );
    if (textif === "yes") {
      docUpload();
      props.refreshCard();
    } else {
      props.closeUpload();
    }
  };
  const docUpload = async () => {
    let i = 0;
    await getUserId();

    firebase_db
      .ref(`user/${userUniqueId}/documents/`)
      .once("value")
      .then((snapshot) => {
        temp = snapshot.val();
        console.log(temp);

        if (temp == null) {
          firebase_db
            .ref(`/user/${userUniqueId}/documents/`)
            .child(`0`)
            .set(resultFile, function (error) {
              //console.log(error)
            });
        } else {
          while (temp[i] != undefined) {
            i++;
            if (temp[i] == undefined) {
              firebase_db
                .ref(`/user/${userUniqueId}/documents/`)
                .child(`${i}`)
                .set(resultFile, function (error) {
                  //console.log(error)
                });
            }
          }
        }
      });
  };
  const pickFileDoc = async () => {
    // try {
        resultFile = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });
    //   const result = await PdfThumbnail.generate(resultFile.uri, 0);
    //   setThumbnail(result);
    //   setError(undefined);
    // } catch (err) {
    //     setThumbnail(undefined);
    //     setError(err);
    //     console.log(err)
    // }
  };
  //#endregion
  return (
    <View style={styles.container}>
      <Modal
        isVisible={props.visible}
        onBackdropPress={() => props.closeUpload()}
      >
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => {
            props.closeUpload();
          }}
        >
          <Icon2 name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.uploadView}>
          <TouchableOpacity
            style={styles.uploadContent}
            onPress={() => {
              ActionImage();
              props.closeUpload();
            }}
          >
            <Icon
              name="images"
              size={50}
              color="#fff"
              style={{ alignSelf: "center" }}
            />
            <Text style={styles.uploadText}>Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadContent}
            onPress={() => {
              ActionVideo();
              props.closeUpload();
            }}
          >
            <Icon
              name="video"
              size={50}
              color="#fff"
              style={{ alignSelf: "center" }}
            />
            <Text style={styles.uploadText}>Video</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadView}>
          <TouchableOpacity
            style={styles.uploadContent}
            onPress={() => {
              ActionDoc();
              props.closeUpload();
            }}
          >
            <Icon2
              name="filetext1"
              size={50}
              color="#fff"
              style={{ alignSelf: "center" }}
            />
            <Text style={styles.uploadText}>Documents</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadContent}
            onPress={() => {
              goWrite();
            }}
          >
            <Icon
              name="pencil"
              size={50}
              color="#fff"
              style={{ alignSelf: "center" }}
            />
            <Text style={styles.uploadText}>Memo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  uploadView: {
    flexDirection: "row",
    alignContent: "center",
    marginTop: 120,
    width: "100%",
  },
  uploadText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
  uploadContent: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
  },
  closeModal: {
    alignItems: "flex-end",
    marginRight: 20,
  },
});
