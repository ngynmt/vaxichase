import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import hash from 'object-hash';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

function RecordEntry({ locations }) {
  const CREATE_LOCATION = gql`
  mutation CreateLocation($name: String!, $id: String!, $position: LatLngInput!) {
    createLocation(name: $name, id: $id, position: $position)
  }
  `;

  const CREATE_REPORT = gql`
    mutation CreateReport($success: Boolean!, $locationId: String!) {
      createReport(success: $success, locationId: $locationId)
    }
  `;

  // const REMOVE_LOCATION = gql`
  // mutation RemoveLocation($id: String!) {
  //   removeLocation(id: $id)
  // }
  // `;

  const [createLocation] = useMutation(CREATE_LOCATION);
  const [createReport] = useMutation(CREATE_REPORT);
  const [address, updateAddress] = useState('');
  const [latLng, updateLatLng] = useState(null);
  const [wasSuccess, updateSuccess] = useState('true');

  const handleSelect = (address) => {
    updateAddress(address.split(',')[0]);
    geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng => updateLatLng(latLng))
    .catch(error => console.error('Error', error));
  }
  
  return (
    <div className="record-entry modal">
      <h1>Record Attempt</h1>
      <form onSubmit={e => {
        e.preventDefault();
        let locationHash = hash(latLng);
        if (locations.filter((location) => location.id === locationHash).length === 0) {
          createLocation({ variables: {
            name: address,
            id: locationHash,
            position: latLng
          }});
        }

        createReport({
          variables: {
            success: wasSuccess === 'true',
            locationId: locationHash,
          }
        })
        window.location.reload();
      }}>
        <PlacesAutocomplete
          value={address}
          onChange={updateAddress}
          onSelect={handleSelect}>
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <TextField
                {...getInputProps({
                  label: 'Enter vaccine location',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion, idx) => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}

                      key={idx}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <section className="form-section">
          <FormControl component="fieldset">
            <FormLabel component="legend">Did you successfully get vaccinated?</FormLabel>
            <RadioGroup row className="radio-group" aria-label="success" value={wasSuccess} onChange={(e) => updateSuccess(e.target.value)}>
              <FormControlLabel value="true" control={<Radio />} label="yes" />
              <FormControlLabel value="false" control={<Radio />} label="no" />
            </RadioGroup>
          </FormControl>
        </section>
        <Button disabled={!latLng} variant="contained" color="primary" className="button--fw btn btn-primary px-5 my-2" type="submit">Submit</Button>
      </form>      
    </div>
  );
}

export default RecordEntry;