import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { getCateringTeams, getDecorationTeams, getVenueTeams } from '../services/decorationService';

const eventTypes = ['Wedding', 'Bridal Shower', 'Birthday Party'];

const EventDetail = () => {
  const [selectedEventType, setSelectedEventType] = useState('');
  const [selectedDecorationTeam, setSelectedDecorationTeam] = useState(null);
  const [selectedCateringTeam, setSelectedCateringTeam] = useState(null);
  const [selectedVenueTeam, setSelectedVenueTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTeamType, setSelectedTeamType] = useState('');
  const [decorations, setDecorations] = useState([]);
  const [caterings, setCaterings] = useState([]);
  const [venues, setVenues] = useState([]);


  console.log(decorations);
  
  useEffect(() => {
    const parseDateArray = (dateArray) => {
        try {
          // Combine array elements into a single string
          const combinedString = dateArray.join('');
      
          // Clean the combined string
          const cleanedString = combinedString
            .replace(/^\["/, '[')           // Remove leading escaped quote
            .replace(/"\]$/, ']')           // Remove trailing escaped quote
            .replace(/\\\"/g, '"')         // Replace escaped quotes
            .replace(/\\/g, '');           // Remove backslashes
      
          // Parse the cleaned JSON string
          const parsedArray = JSON.parse(cleanedString);
      
          // Convert to Date objects
          return parsedArray.map(dateString => new Date(dateString));
        } catch (e) {
          console.error('Error parsing date array:', e);
          return [];
        }
      };




      
const convertDates = (dateArray) => {
    try {
      // Step 1: Combine array elements into a single string
      const combinedString = dateArray.join('');
      
      // Step 2: Fix the format manually
      // Ensure the string has proper JSON format
      // Remove leading and trailing quotes
      const cleanedString = combinedString
        .replace(/^\["/, '[')         // Remove leading escaped quote
        .replace(/"\]$/, ']')         // Remove trailing escaped quote
        .replace(/\\\"/g, '"');       // Replace escaped quotes with regular quotes
  
      // Step 3: Manually parse the cleaned string to handle malformed JSON
      // First, remove any extraneous characters
      const fixedString = cleanedString
        .replace(/\\\"/g, '"')       // Fix any remaining escaped quotes
        .replace(/"\s*$/, '"');      // Remove any trailing extra quotes
  
      // Check if the string is valid JSON
      const parsedArray = JSON.parse(fixedString);
  
      // Step 4: Convert each date string to "yyyy-MM-dd" format
      const formattedDates = parsedArray.map(dateString => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // Check for invalid date
          console.error(`Invalid date string: ${dateString}`);
          return null;
        }
        return date.toISOString().split('T')[0]; // Format as "yyyy-MM-dd"
      }).filter(date => date !== null); // Remove invalid dates
  
      return formattedDates;
    } catch (e) {
      console.error('Error parsing and converting dates:', e);
      return [];
    }
  };


      
      const fetchTeams = async () => {
        try {
          const [decorationData, cateringData, venueData] = await Promise.all([
            getDecorationTeams(),
            getCateringTeams(),
            getVenueTeams()
          ]);

          
      
          // Process and parse availableDates
          setDecorations(decorationData.map(team => ({
            ...team,
            availableDates: convertDates(team.availableDates)
          })));
          setCaterings(cateringData.map(team => ({
            ...team,
            availableDates: convertDates(team.availableDates)
          })));
          setVenues(venueData.map(team => ({
            ...team,
            availableDates: convertDates(team.availableDates)
          })));
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      };
      
      

    fetchTeams();
  }, []);

  const handleEventTypeSelect = (eventType) => {
    setSelectedEventType(eventType);
  };

  const handleTeamClick = (team, teamType) => {
    setCurrentTeam(team);
    setSelectedTeamType(teamType);
    setShowTeamModal(true);
  };

  console.log("currentTeam",currentTeam);
  

  const handleSelectTeam = () => {
    if (currentTeam) {
      const selectedDetails = { ...currentTeam, dates: selectedDates.map(date => format(date, 'yyyy-MM-dd')) };

      if (selectedTeamType === 'decoration') {
        setSelectedDecorationTeam(selectedDetails);
      } else if (selectedTeamType === 'catering') {
        setSelectedCateringTeam(selectedDetails);
      } else if (selectedTeamType === 'venue') {
        setSelectedVenueTeam(selectedDetails);
      }

      setShowTeamModal(false);
    }
  };

  const handleDateChange = (dates) => {
    setSelectedDates(dates);
  };

  const renderTeamDetailsModal = () => (
    <Modal show={showTeamModal} onHide={() => setShowTeamModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{currentTeam.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={currentTeam.logo} alt={currentTeam.name} className="img-fluid mb-3" />
        <p>{currentTeam.description}</p>
        <h6>Services: {currentTeam.services}</h6>
        <h6>Budget: {currentTeam.budget}</h6>
        <h6>Available Dates:</h6>
        <DatePicker
            selected={selectedDates[0] || null}
            onChange={handleDateChange}
            inline
            highlightDates={currentTeam ? currentTeam.availableDates : []}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            selectsMultiple
            shouldCloseOnSelect={false}
            />

        <h6>Images:</h6>
        <div className="row">
          {currentTeam.images.map((image, index) => (
            <div key={index} className="col-md-3">
              <img src={image} alt={`team ${index}`} className="img-fluid" />
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleSelectTeam} disabled={selectedDates.length === 0}>
          Select Team
        </button>
      </Modal.Footer>
    </Modal>
  );

  const renderTeamList = (teamType, teams) => (
    <div className="row">
      {teams.map((team) => (
        <div key={team.id} className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{team.name}</h5>
              <button
                onClick={() => handleTeamClick(team, teamType)}
                className="btn btn-primary"
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mt-4">
      {/* Main Title and Description */}
      <h1>EVENT PLANNING</h1>
      <p>Plan your perfect event by selecting from our options below.</p>

      {/* Tabs for Different Sections */}
      <Tabs>
        <TabList>
          <Tab>Select Your Event</Tab>
          <Tab>Select Decoration Team</Tab>
          <Tab>Select Catering Team</Tab>
          <Tab>Select Venue Team</Tab>
        </TabList>

        <TabPanel>
          <div className="mt-4">
            <h4>Select Your Event</h4>
            <div className="btn-group">
              {eventTypes.map((eventType) => (
                <button
                  key={eventType}
                  className={`btn btn-outline-primary ${selectedEventType === eventType ? 'active' : ''}`}
                  onClick={() => handleEventTypeSelect(eventType)}
                >
                  {eventType}
                </button>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="mt-4">
            <h4>Select Decoration Team</h4>
            {renderTeamList('decoration', decorations)}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="mt-4">
            <h4>Select Catering Team</h4>
            {renderTeamList('catering', caterings)}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="mt-4">
            <h4>Select Venue Team</h4>
            {renderTeamList('venue', venues)}
          </div>
        </TabPanel>
      </Tabs>

      {/* Selected Services Section */}
      {(selectedEventType || selectedDecorationTeam || selectedCateringTeam || selectedVenueTeam) && (
        <div className="mt-5">
          <h4>Selected Services</h4>
          <ul className="list-group">
            {selectedEventType && (
              <li className="list-group-item">
                Event: {selectedEventType}
              </li>
            )}
            {selectedDecorationTeam && (
              <li className="list-group-item">
                Decoration: {selectedDecorationTeam.name} on {selectedDecorationTeam.dates.map(date => new Date(date).toDateString()).join(', ')}
              </li>
            )}
            {selectedCateringTeam && (
              <li className="list-group-item">
                Catering: {selectedCateringTeam.name} on {selectedCateringTeam.dates.map(date => new Date(date).toDateString()).join(', ')}
              </li>
            )}
            {selectedVenueTeam && (
              <li className="list-group-item">
                Venue: {selectedVenueTeam.name} on {selectedVenueTeam.dates.map(date => new Date(date).toDateString()).join(', ')}
              </li>
            )}
          </ul>
          <button className="btn btn-primary mt-3">Add to Cart</button>
          <button className="btn btn-success mt-3 ml-2">Book Now</button>
        </div>
      )}

      {/* Modal for Team Details and Date Selection */}
      {showTeamModal && renderTeamDetailsModal()}
    </div>
  );
};

export default EventDetail;
