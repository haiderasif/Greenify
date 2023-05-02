import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useFormikContext } from "formik";
import AppPicker from "../AppPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

import ErrorMessage from "../forms/ErrorMessage";

function AppFormPicker({
  placeholder,
  items,
  numberOfColumns,
  name,
  width,
  PickerItemComponent,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    items[1].startDate = moment(date).format("MM/DD/YYYY")
    items[1].startTime = moment(date).format('h:mma')
    hideDatePicker();
  };
  return (
    <>
      <AppPicker
        items={items}
        onSelectItem={(item) => setFieldValue(name, item)}
        numberOfColumns={numberOfColumns}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
        width={width}
      />
   {(values.category.label == 'campaign') ? (
    <View style = {styles.Textcontainer}>
        <Text style = {{alignSelf: 'center'}}>{items[1].startDate +", "+ items[1].startTime}</Text>
        <Text onPress={showDatePicker} style = {{color: '#16C79A', paddingLeft: 60}}>Set Start Date</Text>
        <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode = "datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  ) : null
    }
    
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}
const styles = StyleSheet.create({
    Textcontainer: {
      //backgroundColor: colors.light,
      borderRadius: 5,
      borderWidth: 1,
      flexDirection: "row",
      width: "90%",
      padding: 15,
      marginVertical: 10,
      marginLeft: 20,
    },
  });
export default AppFormPicker;
