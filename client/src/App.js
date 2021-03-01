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
  const [delayed, setDelayed] = useState(true);
  
  setTimeout(() => setDelayed(false), 2000);
  if (delayed || loading || reportLoading) return <Landing />;
  if (error || reportError) {
    return error ? <p>{error}</p> : <p>{reportError}</p>
  };
  if (!data) return <p>Records not found.</p>;

  return (
    <div className="app animate__animated animate__fadeIn">
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
      <div className="footer subtext">
          <p>Did you know? Some COVID-19 vaccine doses are only usable for several hours after being thawed from their subzero storage temperature.
          Prevent the waste of extra doses by sharing your successful and failed attempts to get a leftover dose at the end of the day at a specific location.</p>
          <p className="about-app">This application was built by <a href="https://linkedin.com/in/nguyenchelle">Michelle Nguyen</a> with React, Node.js, GraphQL and FaunaDB. Deployed on Netlify.</p>
      </div>
    </div>
  );
}

export default App;