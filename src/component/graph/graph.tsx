import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { Slider, Box } from '@mui/material';
import { fetchPopulationData } from '../../services/api';
import { PopulationData } from '../../types/PopulationData';


const historyLengths: number[] = [3, 5, 10];
const minHistoryLength: number = Math.min(...historyLengths)
const maxHistoryLength: number = Math.max(...historyLengths)

const marks = historyLengths.map(length => ({
    value: length,
    label: `${length} years`,
}));

const PopulationGraph: React.FC = () => {
    const [yearsLabels, setYearsLabels] = useState<number[]>([]);
    const [dataValues, setDataValues] = useState<number[]>([]);
    const [populationData, setpopulationData] = useState<PopulationData[]>([]);

    useEffect(() => {
        loadPopulationData();
    }, []);

    const loadPopulationData = async () => {
        try {
            const data = await fetchPopulationData();

            setpopulationData(data.sort((a, b) => b.Year - a.Year));

            updateGraphData(maxHistoryLength, data);
        } catch (error) {
            console.error("Failed to load data:");
        }
    };

    const updateGraphData = (yearLength: number, data: PopulationData[]) => {
        const slicedData = data.slice(0, yearLength);

        const years = slicedData.map(item => item.Year);
        const populations = slicedData.map(item => item.Population);

        setYearsLabels(years);
        setDataValues(populations);
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            updateGraphData(newValue, populationData);
        }
    };

    return (
        <Box sx={{ width: 600 }}>
            <Slider
                step={null}
                marks={marks}
                max={maxHistoryLength}
                min={minHistoryLength}
                defaultValue={maxHistoryLength}
                onChange={handleChange}
            />
            <LineChart
                height={300}
                viewBox={{height: 400}}
                series={[{ data: dataValues}]}
                xAxis={[{ data: yearsLabels, scaleType: 'band' }]}
            />
        </Box>
    );
};

export default PopulationGraph;