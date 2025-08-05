import axios from "axios";

export default axios.create({
  //baseURL: "https://ats.aragis.com/"
  // baseURL: 'https://ats.araskargo.com.tr/',
  baseURL: 'http://localhost:80',
});