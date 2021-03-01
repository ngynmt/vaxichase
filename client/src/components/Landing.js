import React from 'react';

function Landing() {
  return (
    <div className="landing">
      <h1>vaxichase</h1>
      <div className="emojis animate__animated animate__slideInRight animate__slideOutLeft">
      💉🏃‍♂️🏃‍♀️🏃🦠
      </div>
      <p class="subtext"><strong>Did you know?</strong> Some COVID-19 vaccine doses are only usable for several hours after being thawed from their subzero storage temperature.
        Prevent the waste of extra doses by sharing your successful and failed attempts to get a leftover dose at the end of the day at a specific location.</p>
    </div>
  );
};

export default Landing;