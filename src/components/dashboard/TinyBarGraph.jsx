import { useState, useEffect } from 'react';
import { useStore } from "../../Context/Store";
import { BarChart, Bar, ResponsiveContainer, XAxis, LabelList, Cell } from 'recharts';
import Card from '../Card';



const TinyBarGraph = ({ type, title, data }) => {
    const { setUserChoice } = useStore();
    const [filterChoice, setFilterChoice] = useState('yearly');


    const renderCustomizedLabel = ({ x, y, value, name, payload }) => {
        const barWidth = document.querySelector('.recharts-bar-background-rectangle').getBoundingClientRect().width;
        const [dataPoints] = useState(setUserChoice(data, filterChoice, 'one-param'));
        const [total, setTotal] = useState(0);

        useEffect(() => {
            let sum = 0
            dataPoints.map((point) => (
                sum += point.value
            ))
            setTotal(sum);

        }, []);

    



        return (
            <g>
                <text className="parag_16 light" x={0} y={y - 10} fill="#18181B" textAnchor="end" dominantBaseline="start" width="100%">
                    {value === 0 ? 0 : Math.trunc((value / total) * 100)}%
                </text>
                <text className="parag_16 light" x={barWidth} y={y - 10} fill="#18181B" textAnchor="start" dominantBaseline="end">
                    {name} הודעות
                </text>
            </g>
        );
    };

    return (
        <Card
            title={title}
            type={type}
            dataType={'chart'}
            change={(choice) => setFilterChoice(choice.value)}
            filter={true}

        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={600}
                    barCategoryGap={15}
                    height={800}
                    layout="vertical"
                    data={setUserChoice(data, filterChoice, 'one-param')}
                    margin={{
                        top: 70,
                        right: 0,
                        left: 0,
                        bottom: 30,
                    }}
                    barSize={20}


                >
                    <Bar
                        dataKey="value"
                        fill="#1A8AFF"
                        background={{ fill: '#F4F4F5', radius: 30 }}
                        barSize={18} radius={[30, 30, 30, 30]}

                    >
                        <LabelList dataKey="value" content={renderCustomizedLabel} />
                    </Bar>

                    <XAxis
                        type="number"
                        hide
                        reversed 
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default TinyBarGraph;
