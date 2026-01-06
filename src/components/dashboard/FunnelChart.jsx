import React, { useEffect } from "react";
import Card from "../Card";
import { useState } from "react";
import { useStore } from "../../context/Store";


const FunnelChart = ({ title, subTitle, data, shape, type }) => {
    const [dataPoints, setDatapoints] = useState([]);
    const [total, setTotal] = useState(0);
    const { users } = useStore();

    const today = Object.keys(data.today)
        .sort((a, b) => data.today[b] - data.today[a])
        .reduce((acc, key) => {
            acc[key] = data.today[key];
            return acc;
        }, {});

    data = { ...data, today }


    const dataArray = [];

    Object.keys(data).map((key) => {
        dataPoints.push(key);
    });



    const getChangePercentage = (key) => {

        let today = data[dataPoints[0]][key];
        let past30Days = data[dataPoints[1]][key];
        // let difference = today - past30Days;

        let result = ((today / past30Days) - 1) * 100;
        // let result = (difference / avg) * 100;

        let arrow = '';

        if (past30Days !== 0) {

            if (result === 0) {
                arrow = 'none';
            } else {
                arrow = Math.sign(result) === 1 ? 'up' : 'down';
            }

            return [Math.trunc(Math.abs(result)), arrow]



        } else {
            return false
        }


    }

    useEffect(() => {
        let sum = 0;

        Object.keys(data[dataPoints[0]]).map((point) => {
            sum += data[dataPoints[0]][point]
        });

        setTotal(sum);
    }, []);



    if (dataPoints.length === 0) {
        return null;
    }

    return (

        <Card
            title={title}
            subTitle={subTitle}
            type={type}
            dataType={'funnel-chart'}
            filter={false}
            layout={'double'}
        >
            <ul className="funnel-chart__wrapper">
                {Object.keys(data[dataPoints[0]]).map((key, index) => (

                    <li key={index} className={shape}>
                        <div className={`funnel-chart__calc`}>
                            <div className="funnel-chart__number">
                                <p className="num_22">

                                    {data[dataPoints[0]][key] ? data[dataPoints[0]][key].toLocaleString() : null}
                                    {shape === 'rectangle' && index !== 0 ?
                                        (() => {
                                            const percent = (data[dataPoints[0]][key] / total) * 100;
                                            return Number.isFinite(percent) && !isNaN(percent) ? (
                                                <span className="parag_16">({percent.toFixed(1)}%)</span>
                                            ) : null;
                                        })()
                                        : null}
                                </p>
                                {(() => {
                                    const change = getChangePercentage(key);
                                    const value = change && Array.isArray(change) ? change[0] : null;
                                    return Number.isFinite(value) && value !== 0 ? (
                                        <span className={`percentage_num parag_14 arrow-${change[1]}`}>{value}%</span>
                                    ) : null;
                                })()}


                            </div>
                            <p className="caption_14">{users[key]}</p>
                        </div>
                        {shape === 'polygon' &&
                            <div className="funnel-chart__total-percentage">

                                {console.log('dataPoint', data[dataPoints[0]][key])}
                                {console.log('letters', data[dataPoints[0]]['letters'])}




                                {Number((data[dataPoints[0]]['letters'])) !== 0 && <p className="num_20">{((data[dataPoints[0]][key] / data[dataPoints[0]]['letters']) * 100).toFixed(1)}%</p>}

                                <svg width="41" height="65" viewBox="0 0 41 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M36.6816 65H40.5L40.5 0L7.97321 0C2.61846 0 -0.753426 5.76748 1.87325 10.4337L30.5817 61.4337C31.8218 63.6368 34.1535 65 36.6816 65Z" fill="" />
                                </svg>
                            </div>
                        }
                    </li>
                ))
                }

            </ul>
        </Card>

    )
}

export default FunnelChart;