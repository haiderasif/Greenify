import React, { useContext, useState,useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import * as Yup from "yup";
import { RadioButton } from "react-native-paper";

import Screen from "../components/Screen";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import SubmitButton from "../components/forms/SubmitButton";
import { getAuth } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { getDatabase, ref, onValue,push,set } from 'firebase/database';
import SelectDropdown from 'react-native-select-dropdown'
import colors from "../styles/colors";
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  enrollment: Yup.string().matches(/^([0-9])\w([-])\w([0-9]){5}([-])\w([0-9]{2})\w?$/,'Please enter correct enrollment').required().max(13).label("Enrollment"),
  email: Yup.string().required().email().label("Email"),
  department: Yup.string().required().label("Department"),
});


function CampaignFormScreen({ route}) {
  const detail = route.params;
    useEffect(() => {
        if (isFocused){
          getInitialData()
        }
      },[isFocused])
      const getInitialData = async () => {
        setError(false)
      }

    const auth = getAuth();
    const user = auth.currentUser;
    const isFocused = useIsFocused()
    const [listingDatas,setListingsData] = useState([])
    const [error, setError] = useState(false)
    const dateobj = new Date()
    const month = dateobj.getMonth()+1
    var day = dateobj.getDate()
    if(day<10)
    {
      day = '0'+day
    }
    const year = dateobj.getFullYear()
    const date = month+'/'+day+'/'+year
    const upload = (values) => {
            const db = getDatabase();
            const reference = ref(db, 'CampaignList/');
            push(reference, {
                Name: values.name,
                Enrollment: values.enrollment,
                Email: values.email,
                Department: values.department,
                TreePlanted: "No",
                TreeImage: "",
                CampaignId: detail.detail.detail.userId,
                startDate: detail.detail.detail.startDate,
                UserId: user.uid,
                HavePlant: values.ownPlant,
                University: values.uni,
                CampaignTitle: detail.detail.detail.title
            });
            alert('Data has been uploaded')
        }
    var finished = [];
    const check = (values) => {
        const db = getDatabase();
        const reference = ref(db, 'CampaignList');
        onValue(reference, snapshot => {
        snapshot.forEach((data) => {
        let result = data.val()
        if(result.UserId == user.uid && result.CampaignId==detail.detail.detail.userId && result.CampaignTitle == detail.detail.detail.title)
        {
        result["key"]  = data.key;
        finished.push(result)
        return
        }
      })
      setListingsData(finished)
    })
    }
    const countriesWithFlags = [
      'Bahria University',
       'Air University',
    ];
    const [university, setUniversity] = useState('Bahria University')
    const [checked, setChecked] = useState('Yes');
  return (
    <>
    <ScrollView style = {{backgroundColor: '#F8F1F1'}}>
    <Screen style={styles.container}>
      <AppForm
        initialValues={{ name: user.displayName, enrollment: "", email: "", department: "", ownPlant: checked, uni: university }}
        onSubmit={(values,{resetForm}) => {
            check(values)
            if(!finished.length==0)
            {
                setError(true)
            }
            else{
                values.ownPlant = checked
                values.uni = university
                console.log(values);
                setError(false)
                upload(values)
                resetForm({values: ""})
            }
                }}
                validationSchema={validationSchema}
      >
        {university == 'Bahria University' ? (<Image style = {{width: 100, height: 100 ,alignSelf: 'center', borderRadius: 25, marginTop: -30, marginBottom: 40}} source={require("../../assets/bahria.jpeg")}/>) : (<Image style = {{width: 100, height: 100 ,alignSelf: 'center', borderRadius: 25, marginTop: -30, marginBottom: 40}} source={require("../../assets/Air.png")}/>)}
        <AppFormField
          autoCorrect={false}
          icon="account"
          name="name"
          placeholder="Name"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="key-variant"
          name="enrollment"
          keyboardType="phone-pad"
          placeholder="Enrollment"
          textContentType="telephoneNumber"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          keyboardType="email-address"
          name="email"
          placeholder="Email"
          textContentType="emailAddress"
        />
        <View>
          <SelectDropdown
          data={countriesWithFlags}
          defaultValue={'Bahria University'}
          buttonStyle = {{backgroundColor: colors.light,
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: "row",
            marginVertical: 10,
            marginLeft: 20,
          }}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
            }}
          onSelect={(selectedItem) => {
            setUniversity(selectedItem)
          }}
        />
        </View>
        <AppFormField
          autoCorrect={false}
          icon="library"
          name="department"
          placeholder="Department"
        />
        
        <View>
      <View style = {{marginLeft: 20, flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
        <Text style= {{paddingRight: 10, fontSize: 15}}>Do you have your own plant?</Text>
        <View style = {{flexDirection: 'row', alignItems: 'center'}}>
      <RadioButton
      color= "green"
        value="first"
        status={ checked === 'Yes' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('Yes')}
      />
      <Text>Yes</Text>
      </View>
      <View style = {{flexDirection: 'row', alignItems: 'center'}}>
      <RadioButton
        color= "green"
        value="second"
        status={ checked === 'No' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('No')}
      />
       <Text>No</Text>
      </View>
      </View>
    </View>
        <SubmitButton title="Submit"  bgcolor = {'#16C79A'} width = {'90%'}/>
      </AppForm>
      {error ? (<Text>User already registered</Text>) : null }
    </Screen>
    </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    
    paddingTop: 50
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
});

export default CampaignFormScreen;
