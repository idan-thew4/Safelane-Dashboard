import { useEffect, useRef, useState } from "react";
import { useStore } from "../../Context/Store";
import { BarChart, Bar, ZAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toolTipHover from '../../assets/bar-chart_tooltip-hover.svg'
import Card from "../Card";



const BarGraph = ({ type, title, data, legend }) => {
    const { months, days, setUserChoice } = useStore();
    const [filterChoice, setFilterChoice] = useState('yearly');
    const [period, setPeriod] = useState();
    let [posData, setposData] = useState({ x: 0 });
    const [toolTipLabel, setToolTipLabel] = useState(months);

    console.log('data', data)




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

        }, [active, coordinate]);



        if (active && payload && payload.length) {


            return (
                <>

                    <div className="dv_tooltip" ref={toolTip}>
                        <p className="label parag_12">{`${filterChoice === 'monthly' ? `${label}` : toolTipLabel[label]} ${period}`}</p>
                        <ul className="dv_legend">
                            {payload.map((item, index) => (

                                <li key={index} className={item.dataKey} >

                                    <p className="dv_tooltip_legend_data_point parag_14"> {legend[index]}</p>
                                    <p className="parag_14"> {payload[payload.length - 1 - index].value.toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <img className="dv_tooltip_spotlight" src={toolTipHover} ></img>
                </>

            );
        } else {


        }

        return null;
    };

    const CustomizedLegend = ({ payload }) => {

        return (
            <ul className="dv_legend">
                {payload.map((item, index) => (
                    <li key={index} className={item.dataKey} >
                        <p className="dv_tooltip_legend_data_point parag_14"> {legend[index]}</p>
                    </li>
                ))}
            </ul>);
    };


    console.log(setUserChoice(data, filterChoice, 'two-param'))


    return (
        <Card
            title={title}
            filter={true}
            type={type}
            dataType={'chart'}
            change={(choice) => setFilterChoice(choice.value)}

        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={setUserChoice(data, filterChoice, 'two-param')}
                    margin={{
                        top: 8,
                        right: 0,
                        left: 10,
                        bottom: 6,
                    }}


                >
                    <CartesianGrid
                        strokeDasharray="3 0"
                    />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        dy={15}
                    />
                    <ZAxis range={[100, 31]} />
                    <Tooltip
                        content={<CustomTooltip />}
                        position={{ x: posData, y: -25 }}
                        cursor={{ fill: 'none' }}
                        active={true}
                        wrapperStyle={{ visibility: "visible" }}
                    />
                    <Legend content={<CustomizedLegend />} verticalAlign="top" align="right" height={60} />
                    <Bar dataKey="value1" fill="#1A8AFF" barSize={18} radius={[30, 30, 0, 0]} />
                    <Bar dataKey="value2" fill="#0012AE" barSize={18} radius={[30, 30, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>

    )

}



export default BarGraph;