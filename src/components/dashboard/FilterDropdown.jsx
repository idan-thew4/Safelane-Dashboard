import React from "react";
import { useStore } from "../../Context/Store";
import Select, { components } from "react-select";
import selectArrow from "../../assets/arrow-down.svg"

const FilterDropdown = ({ change }) => {
    const { filters, getformatData} = useStore();

    return (
        <Select
        components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }} 
        //   menuIsOpen={true}
            className="filter-dropdown"
            classNamePrefix="filter-dropdown"
            options={filters}
            defaultValue={filters[0]}
            onChange={change}
        />

    )
}

export default FilterDropdown;