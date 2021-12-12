import axios from 'axios';
const baseUrl = '/api/login';

const loginUser = async credentials => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const ops = { loginUser, };
export default ops;