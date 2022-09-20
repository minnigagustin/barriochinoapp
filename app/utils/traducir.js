import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from "../constants/config";
axios.defaults.baseURL = baseURL;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const Obteneridioma = async () => {
  var collect;
  try {
    value = await AsyncStorage.getItem('idioma').then(
      (values) => {
        collect = values;
      });
  } catch (error) {
    return 'action -> ' + error
  }
  return await collect;
}
export default Obteneridioma;
