import React from 'react';
import axios from 'axios';
import PopulationGraph from './graph';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PopulationGraph Component', () => {
    const mockData = [
        { Year: 2023, Population: 331000000 },
        { Year: 2022, Population: 330000000 },
        { Year: 2021, Population: 329000000 },
        { Year: 2020, Population: 328000000 },
        { Year: 2019, Population: 327000000 },
    ];

    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
            data: { data: mockData },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<PopulationGraph />);
        expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('updates the chart data when slider value changes', async () => {
        render(<PopulationGraph />);
        
        // Wait for initial data fetch
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));

        const slider = screen.getByRole('slider');

        // Change slider to 5 years
        fireEvent.change(slider, { target: { value: 5 } });

        // Wait for fetch with new year value
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));

        // Mock data should display 5 most recent years
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://datausa.io/api/data?drilldowns=Nation&measures=Population'
        );
    });
});
