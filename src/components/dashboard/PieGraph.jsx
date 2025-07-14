import React, { useEffect, useState } from "react";
import { useStore } from "../../Context/Store";
import { PieChart, Pie } from "recharts";
import Card from "../Card";
import { useTrackVisibility  } from 'react-intersection-observer-hook';


const PieGraph = ({ type, title, subTitle, data, legend, totalText, filter }) => {
    const { getformatData, setUserChoice } = useStore();
    const [filterChoice, setFilterChoice] = useState('yearly');
    const [dataPoints, setDataPoints] = useState(filter ? setUserChoice(data, filterChoice, 'one-param') : getformatData(data, 'one-param-no-filter'))
    const [total, setTotal] = useState(0);
    const [observer,{ entry, rootRef, isVisible, wasEverVisible }] = useTrackVisibility();

    

    useEffect(() => {
        if(filter) {
            setDataPoints(setUserChoice(data, filterChoice, 'one-param'))
        }

    }, [filterChoice]);






       



    useEffect(() => {

        let sum = 0
        dataPoints.map((point) => (
            sum += point.value
        ))
        setTotal(sum);
    }, [dataPoints]);

    return (
        <Card
            title={title}
            subTitle={subTitle}
            type={type}
            dataType={'pie-chart'}
            filter={filter}
            change={(choice) => setFilterChoice(choice.value)}
            ref={observer}
        >
            <div className="pie-chart__wrapper" >
                <PieChart width={220} height={220} >
                    <Pie
                        data={filter ? setUserChoice(data, filterChoice, 'one-param') : getformatData(data, 'one-param-no-filter')}
                        cx={105}
                        cy={105}
                        innerRadius={92}
                        outerRadius={110}
                        paddingAngle={-10}
                        dataKey="value"
                        cornerRadius={40}
                        startAngle={-280}
                        // endAngle={400}
                        isAnimationActive={wasEverVisible}

                    >
                    </Pie>
                </PieChart>
                <div className="pie-chart__total">
                    <p className="num_30">{total.toLocaleString()}</p>
                    <p className="head_18 dv_total">{totalText}</p>
                </div>
            </div>
            <div className="card__legend">
                <ul>
                    {dataPoints.map((point, index) => (
                        <li key={index} className={`${point.name} parag_16`}>
                            {`${legend[index]} (${point.value.toLocaleString()})`}
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    )

}

export default PieGraph