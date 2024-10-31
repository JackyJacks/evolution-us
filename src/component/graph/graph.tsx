import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts';
import { Slider, Box } from '@mui/material';

interface PopulationData {
    Year: number;
    Population: number;
}

const historyLengths: number[] = [3, 5, 10];

const marks = historyLengths.map(length => ({
    value: length,
    label: `${length} years`,
}));

const PopulationGraph: React.FC = () => {
    const [years, setYears] = useState<number>(10);
    const [yearsLabels, setYearsLabels] = useState<number[]>([]);
    const [dataValues, setDataValues] = useState<number[]>([]);

    useEffect(() => {
        fetchPopulationData(years);
    }, [years]);

    const fetchPopulationData = async (yearLength: number) => {
        try {
            const response = await axios.get('https://datausa.io/api/data?drilldowns=Nation&measures=Population');
            const data: PopulationData[] = response.data.data;

            // havent found the way to do it by API so made it manualy)
            const filteredData = data.sort((a, b) => b.Year - a.Year).slice(0, yearLength);

            const years = filteredData.map(item => item.Year);
            const populations = filteredData.map(item => item.Population);

            setYearsLabels(years);
            setDataValues(populations);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setYears(newValue);
        }
    };

    return (
        <div>
            <Box 
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Box sx={{ width: 600 }}>
                    <Slider
                        step={null}
                        marks={marks}
                        max={Math.max(...historyLengths)}
                        min={Math.min(...historyLengths)}
                        onChange={handleChange}
                    />
                    <LineChart
                        height={300}
                        viewBox={{height: 400}}
                        series={[{ data: dataValues}]}
                        xAxis={[{ data: yearsLabels, scaleType: 'band' }]}
                    />
                </Box>
            </Box>
            
        </div>
    );
};

export default PopulationGraph;