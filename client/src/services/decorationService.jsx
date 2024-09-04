import axios from 'axios';

const API_URL = 'http://localhost:5000/api/decorations';


export const getDecorationTeams = async () => {
  const response = await axios.get('http://localhost:5000/api/decorations');
  console.log(response.data);
  
  return response.data;
};


export const getCateringTeams = async () => {
  const response = await axios.get('http://localhost:5000/api/decorations');
  return response.data;
};


export const getVenueTeams = async () => {
  const response = await axios.get('http://localhost:5000/api/decorations');
  return response.data;
};

export const addDecorationTeam = async (formData) => {
  const response = await axios.post('http://localhost:5000/api/decorations/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

