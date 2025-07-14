import React, { useEffect, useState } from "react";
import { useStore } from "../Context/Store";
import PieGraph from "./dashboard/PieGraph";
import AreaGraph from "./dashboard/AreaGraph";
import SimpleBarGraph from "./dashboard/SimpleBarGraph";
import TinyBarGraph from "./dashboard/TinyBarGraph";
import FunnelChart from "./dashboard/FunnelChart";
import loader from "../assets/loader.svg";
import FilterModal from "./dashboard/FilterModal";





const Dashboard = () => {
    const { filters, getData, setExportFilterIsOpen } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState('');

    useEffect(()=>{console.log(data)}, [data])


    useEffect(() => {
        getData()
            .then((result) => {
                setData({components:result.components, firstDate:result.first_date});
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="loader__wrapper full-screen">
            <img src={loader} />
        </div>;
    }

    return (
        <div className="dashboard basic-grid">
            <FilterModal
            firstDate={data.firstDate}
            />
            <div className="dashboard__header">
                <h1 className="dashboard__headline head_30">תמונת מצב</h1>
                <button className="basic-button with-icon export-icon" onClick={() => setExportFilterIsOpen(true)}>ייצוא נתונים</button>
            </div>
            <div className="dashboard__cards-layout">
                <PieGraph
                    type={'open-inquiries'}
                    title={'התפלגות פניות פתוחות'}
                    subTitle={'על פי זמן מענה'}
                    data={data.components[0].data}
                    totalText={'פניות פתוחות'}
                    legend={['3-4 ימים ', 'מעל 5 ימים', 'עד יומיים',]}
                    filter={false}
                />
                <AreaGraph
                    type={'avg-response'}
                    title={'זמן ממוצע למענה לפניות'}
                    data={data.components[1].data}
                    filters={filters}
                />
                <SimpleBarGraph
                    type={'inquiries-vs-letters'}
                    title={'כמות פניות/מכתבים לתקופת זמן'}
                    legend={['מכתבים', 'פניות']}
                    data={data.components[2].data}
                    filters={filters}
                />
                <PieGraph
                    type={'inqueries'}
                    title={'התפלגות תיוג פניות'}
                    data={data.components[3].data}
                    totalText={'סה”כ פניות'}
                    legend={['ניטרלי', 'שלילי', 'חיובי',]}
                    filter={true}
                />
                <TinyBarGraph
                    type={'texting-per-inquiries'}
                    title={'כמות התכתבויות לפנייה'}
                    data={data.components[6].data}
                />
                <FunnelChart
                    type={'users-details-flow'}
                    shape={'polygon'}
                    title={'זרימת משתמשים - השארת פרטים'}
                    subTitle={'בהשוואה ל-30 ימים קודמים'}
                    data={data.components[4].data}
                />
                <FunnelChart
                    type={'conversion-rate'}
                    shape={'rectangle'}
                    title={'אחוזי המרה - צפייה בסרטון'}
                    subTitle={'בהשוואה ל-30 ימים קודמים'}
                    data={data.components[5].data}
                />
            </div>
        </div>
    )
}

export default Dashboard;

