import { useEffect, useState, useRef } from "react";
import { useStore } from "../../Context/Store";
import { AreaChart, Area, XAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from "../Card";



const AreaGraph = ({ type, title, data }) => {
    const { months, days, getDaysAndHours, setUserChoice } = useStore();
    const [filterChoice, setFilterChoice] = useState('yearly');
    const [period, setPeriod] = useState();
    let [posData, setposData] = useState({ x: 0 });
    const [toolTipLabel, setToolTipLabel] = useState(months);


    useEffect(() => {


        switch (filterChoice) {
            case 'yearly':
                setPeriod(data.yearly.year);
                setToolTipLabel(months);
                break;
            case 'monthly':
                setPeriod(data.monthly.month);
                break;
            case 'daily':
                setPeriod(data.daily.days);
                setToolTipLabel(days);
        }


    }, [filterChoice])

    const CustomTooltip = ({ active, payload, label, coordinate }) => {
        let toolTip = useRef();

        useEffect(() => {

            if (active) {
                setposData(coordinate.x - (toolTip.current.offsetWidth / 2));
            }

        }, [active, coordinate])

        if (active && payload && payload.length) {
            return (
                <div className="dv_tooltip" ref={toolTip}>
                    {/* <p className="parag_12">{`${filterChoice === 'monthly' ? `${label}/` : toolTipLabel[label]} ${period}`}</p> */}
                    <p className="parag_12">{label}</p>
                    <p className="parag_13">{getDaysAndHours(payload[0].value)}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <Card
            title={title}
            type={type}
            dataType={'chart'}
            // filter={true}
            change={(choice) => setFilterChoice(choice.value)}
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    width={500}
                    height={400}
                    data={setUserChoice(data, filterChoice, 'one-param')}
                    margin={{
                        top: 50,
                        right: 7,
                        left: 20,
                        bottom: 6,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 0" horizontalPoints={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        dy={15}
                    />
                    <ZAxis range={[100, 31]} />
                    <Tooltip
                        content={<CustomTooltip />}
                        position={{ x: posData, y: 10 }}
                        cursor={{ stroke: '#7B7B7B', strokeWidth: 2, strokeDasharray: 3 }} />
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#26318F" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#F0F3FC" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="value"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>


    )
}

export default AreaGraph;
