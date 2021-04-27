import axios from "axios";
import https from "https";

import * as mock from  "./mock.users.js";
const BASE_URL = "https://localhost:8230/api";
const httpsAgent = new https.Agent({rejectUnauthorized: false});

test("User", async () => {
  const createUserEndpoint = `${BASE_URL}/user/create`;

  try{
    const response = await axios.post(createUserEndpoint, mock.validUser, {httpsAgent});
    const {user, token} = response.data.result;
    expect(user).not.toBe(null);

    for(let key of Object.keys(mock.validUser)){
      expect(user[key]).toBe(mock.validUser[key]);
    }

    expect(token.split('.').length).toBe(3);
  }
  catch (e) {
    console.log(e);
    console.error(e.response.data);
    throw e;
  }
});