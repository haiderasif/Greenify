import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export const MapInput = ({notifyChange}) => {
    const isAndroid = Platform.OS ==='android'
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        minLength={2} // minimum length of text to search
        autoFocus={true}
        returnKeyType={'search'} // Can be left out for default return key
        listViewDisplayed={false} // true/false/undefined
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          notifyChange(details.geometry.location);
        }}
        query={{
          key: 'AIzaSyBy9zj9lPNOZWZHenVb3uf1S1NHXgzdrJk',
          language: 'en',
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
        styles={{
          textInputContainer: {
            padding: 16,
          },
          listView: {
            padding: 16,
           
            zIndex: 100000,
            paddingBottom: 250,
          },
          container: {
            top: isAndroid ? 27 : 50,
            width: isAndroid ? 350 : '100%',
            zIndex: 100000,
          },
        }}
      />
    );
  }