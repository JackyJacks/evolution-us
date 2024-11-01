import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { Slider, Box } from '@mui/material';
import { fetchPopulationData } from '../../services/api';


const historyLengths: number[] = [3, 5, 10];
const minHistoryLength: number = Math.min(...historyLengths)
const maxHistoryLength: number = Math.max(...historyLengths)

const marks = historyLengths.map(length => ({
    value: length,
    label: `${length} years`,
}));

const PopulationGraph: React.FC = () => {
    const [years, setYears] = useState<number>(maxHistoryLength);
    const [yearsLabels, setYearsLabels] = useState<number[]>([]);
    const [dataValues, setDataValues] = useState<number[]>([]);

    useEffect(() => {
        loadPopulationData(years);
    }, [years]);

    const loadPopulationData = async (yearLength: number) => {
        try {
            const data = await fetchPopulationData()

            const filteredData = data.sort((a, b) => b.Year - a.Year).slice(0, yearLength);

            const years = filteredData.map(item => item.Year);
            const populations = filteredData.map(item => item.Population);

            setYearsLabels(years);
            setDataValues(populations);
        } catch (error) {
            console.error("Failed to load data:");
        }
    };

    const handleChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setYears(newValue);
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