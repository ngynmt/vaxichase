import React, { useState } from 'react';
import './App.css';
import VaxTable from './components/VaxTable';
import Landing from './components/Landing';
import VaxMap from './components/VaxMap';
import { Button, Modal } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import RecordEntry from './components/RecordEntry';

const READ_LOCATIONS = gql`
  query locations {
    locations {
      id
      name
      position {
        lat
        lng
      }
    }
  }
`;

const READ_REPORTS = gql`
  query reports {
    reports {
      locationId
      success
    }
  }
`;

function App() {
  let { data, loading, error } = useQuery(READ_LOCATIONS);
  let { data: reportData, loading: reportLoading, error: reportError } = useQuery(READ_REPORTS);
  const [modalIsOpen, toggleModal] = useState(false);

  // loading = true;
  if (loading || reportLoading ) return <Landing />;
  if (error || reportError) return <p>An error occurred.</p>;
  if (!data) return <p>Records not found.</p>;

  return (
    <div className="app">
      <Modal open={modalIsOpen} onClose={() => toggleModal(false)} className="modal-container">
        <RecordEntry locations={data.locations} reports={reportData?.reports} />
      </Modal>
      <div className="vax-map">
        <VaxMap locations={data.locations} reports={reportData?.reports} />
      </div>
      <div className="gutters">
        <Button variant="contained" color="primary" className="button--fw" onClick={() => toggleModal(true)}>Add Entry</Button>
      </div>
      <VaxTable locations={data.locations} reports={reportData?.reports} />
    </div>
  );
}

export default App;