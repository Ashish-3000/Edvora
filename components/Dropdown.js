import styles from "./dropdown.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

function Dropdown({
  values,
  setcurrState,
  setcurrCity,
  setupcomingRides,
  setpastRides,
  setnearestRides,
}) {
  let instates = [];
  values.map((item) => {
    instates.push(item.state);
  });
  instates = instates.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
  const [cities, setCities] = useState([]);

  const handleClick = (val) => {
    setcurrState(val);
    setCities([]);
    setupcomingRides([]);
    setnearestRides([]);
    setpastRides([]);
    values.map((item) => {
      if (item.state == val) {
        setCities((prev) => [...prev, item.city]);
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        const currmonth = parseInt(item.date.substr(0, 2));
        const currday = parseInt(item.date.substr(3, 2));
        const curryear = parseInt(item.date.substr(6));

        if (curryear == year && day == currday && currmonth == month) {
          setnearestRides((prev) => [...prev, item]);
        } else if (
          curryear < year ||
          (year === curryear && month > currmonth) ||
          (year === curryear && month === currmonth && day > currday)
        ) {
          setpastRides((prev) => [...prev, item]);
        } else {
          setupcomingRides((prev) => [...prev, item]);
        }
      }
    });
  };

  const handleChange = (val) => {
    setcurrCity(val);
    setupcomingRides([]);
    setnearestRides([]);
    setpastRides([]);
    values.map((item) => {
      if (item.city == val) {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        const currmonth = parseInt(item.date.substr(0, 2));
        const currday = parseInt(item.date.substr(3, 2));
        const curryear = parseInt(item.date.substr(6));
        if (curryear == year && day == currday && currmonth == month) {
          setnearestRides((prev) => [...prev, item]);
        } else if (
          curryear < year ||
          (year === curryear && month > currmonth) ||
          (year === curryear && month === currmonth && day > currday)
        ) {
          setpastRides((prev) => [...prev, item]);
        } else {
          setupcomingRides((prev) => [...prev, item]);
        }
      }
    });
  };

  return (
    <div className={styles.dropdown_main}>
      <div className={styles.dropdown_heading}>Filters</div>
      <div className={styles.line}></div>
      <div className={styles.drop}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={styles.trigger}>
            State
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className={styles.content}>
            {instates.map((item, index) => {
              return (
                <DropdownMenu.Item
                  key={index}
                  className={styles.item}
                  id={item}
                  onClick={(e) => {
                    handleClick(e.target.id);
                  }}
                >
                  {item}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={styles.trigger}>
            Cities
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className={styles.content}>
            {cities.map((item, index) => {
              return (
                <DropdownMenu.Item
                  key={index}
                  className={styles.item}
                  id={item}
                  onClick={(e) => {
                    handleChange(e.target.id);
                  }}
                >
                  {item}
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}

export default Dropdown;
