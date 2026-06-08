import axios from "axios";

const BASE_URL = "http://161.97.154.119/intern-api/api";
const CategoryService = {

  getOptions: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/options`);
      return response.data;
    } catch (error) {
      console.error("CategoryService - getOptions xətası:", error);
      throw error; 
    }
  }
};

export default CategoryService;