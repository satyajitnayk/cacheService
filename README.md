> Use the below code as library to interact with the caching service.

```
const axios = require("axios");
const {
  CACHE_SERVICE_URI = "",
  CACHE_API_KEY = "",
  CACHE_API_SECRETE = ""
} = process.env;

const Headers = {
  "API_KEY": CACHE_API_KEY,
  "API_SECRETE": CACHE_API_SECRETE
};

const getFromCache = async (key) => {
  try {
    let response = await axios.get(CACHE_SERVICE_URI + "/get/" + key,
      { headers: Headers }
    );
    if (response.status == 200) {
      response = response.data;
      if (response.success) {
        return response.data;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    // console.log(error);
    return null;
  }
}

const setInCache = async (key, value, cacheConfig = { isDB: false, expireIn: "3600" }) => {
  try {
    const data = { key, value, cacheConfig };
    let response = await axios.post(
      CACHE_SERVICE_URI + "/set",
      data,
      { headers: Headers }
    );
    if (response.status == 200) {
      return response.data.success;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

module.exports = {
  getFromCache,
  setInCache
}
```
