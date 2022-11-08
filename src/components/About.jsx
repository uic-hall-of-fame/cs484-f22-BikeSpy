import React from 'react'

function About() {
    return (
        <>
            <h1> CS 484 Final Project: BikeSpy </h1>

  <a href="https://github.com/ckclassrooms/final-project-proposal-twix.git">Twix </a>
  <br></br>
<h2>App deployment: https://cool-conkies-80a0da.netlify.app/ </h2>

<h2>Objectives:</h2> <br></br> 
<ul>
    <li>1. Users should be able to login via Email or an SSO.</li>
    <li>2. Once logged in, users should be able to submit a violation with required details using the form provided (including location).</li>
    <li>3. Users will be able to visualize all the violations submitted for an area and filter data as needed.</li>
    <li>4. Users can also visualize the violations on a map.</li>
</ul>

<br></br>
<h2>Project Summary:</h2>
The project involves a web application that allows users to report and submit the details of any Bike Lane violation. Violations mainly consist of a vehicle parked in the bike lane. The application also allows the user to submit images along with other details of violation. This data is stored in a database and can be accessed by any registered user using the interface provided. 
<br></br>
In addition to the live database view, the data can also be visualized in an interactive map. 
<br></br>
We envision the following security and privacy concerns when managing the user data for our application:
<ul>
    <li>- The location acquired from the device should be securely read and stored.</li>
    <li>- The authentication methods, SSO or User Sign-up, should be implemented securely.</li>
    <li>- All confidential data should be stored in hashed form, and not as plain-text.</li>
</ul>


        </>
    )
}

export default About