import React from "react";

import FilterDropdown from "./dashboard/FilterDropdown";



const Card = React.forwardRef(({ title, subTitle, children, type, dataType, layout, filter, change }, ref) => {
    return (
        <div className={`${type} card ${dataType} ${layout}`} ref={ref}>
            <div className="card__head">
                <h2 className="head_24">{title}</h2>
                {filter ?
                    <FilterDropdown
                        change={change}
                    /> :
                    <h3 className="dv_sub-title head_18">{subTitle}</h3>
                }
            </div>
            <div className="card__data">
                {children}
            </div>
        </div>
    );
});



export default Card;