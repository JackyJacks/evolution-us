import axios from 'axios';
import { PopulationData } from '../types/PopulationData';

const API_BASE_URL = 'https://datausa.io';

export const fetchPopulationData = async (): Promise<PopulationData[]> => {
  try {
    const response = await axios.get<{data: PopulationData[]}>(`${API_BASE_URL}/api/data?drilldowns=Nation&measures=Population`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};