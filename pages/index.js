import { useState, useEffect } from "react";
import Blocks from "../components/Blocks";
import Dropdown from "../components/Dropdown";
import styles from "../styles/Home.module.css";

export default function Home({ values, nRides, uRides, pRides, myProfile }) {
  const [nearestRides, setnearestRides] = useState([]);
  const [upcomingRides, setupcomingRides] = useState([]);
  const [pastRides, setpastRides] = useState([]);

  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(0);
  const [currState, setcurrState] = useState("");
  const [currCity, setcurrCity] = useState("");

  useEffect(() => {
    setupcomingRides(uRides);
    setpastRides(pRides);
    // setnearestRides(nRides);
    sortRides(nRides);
  }, []);

  const sortRides = (nearestRides) => {
    const stcode = myProfile.station_code;
    let p = nearestRides;
    let r = [];
    p.map((item, i) => {
      let x = 1000;
      item.station_path.map((l) => {
        x = Math.min(x, Math.abs(x - l));
      });
      r.push({ x, i, stcode });
    });
    r.sort((a, b) => {
      return a.x - b.x;
    });
    r.map((item) => {
      // console.log(item);
      setnearestRides((prev) => [...prev, p[item.i]]);
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.heading}>
        <p>Edvora</p>
        <div className={styles.userProfile}>
          {myProfile.name}
          <img src={myProfile.url} />
        </div>
      </div>
      <div className={styles.rides}>
        <div className={styles.heading_bar}>
          <div className={styles.ride_heading}>
            <p
              onClick={() => {
                setSelected(0);
              }}
              style={{
                textDecoration: selected == 0 ? "underline" : "none",
                fontWeight: selected == 0 ? "700" : "",
                color: selected == 0 ? "white" : "",
              }}
            >
              Nearest Rides
            </p>
            <p
              onClick={() => {
                setSelected(1);
              }}
              style={{
                textDecoration: selected == 1 ? "underline" : "none",
                color: selected == 1 ? "white" : "",
                fontWeight: selected == 1 ? "700" : "",
              }}
            >
              Upcoming Rides ({upcomingRides.length})
            </p>
            <p
              onClick={() => {
                setSelected(2);
              }}
              style={{
                textDecoration: selected == 2 ? "underline" : "none",
                color: selected == 2 ? "white" : "",
                fontWeight: selected == 2 ? "700" : "",
              }}
            >
              Past Rides ({pastRides.length})
            </p>
          </div>
          <div className={styles.filter}>
            <div
              onClick={() => {
                console.log("clicked");
                setVisible(!visible);
              }}
            >
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M-6.10352e-05 12.0001H5.99994V10.0001H-6.10352e-05V12.0001ZM-6.10352e-05 0.00012207V2.00012H17.9999V0.00012207H-6.10352e-05ZM-6.10352e-05 7.00012H11.9999V5.00012H-6.10352e-05V7.00012Z"
                  fill="white"
                  fillOpacity="0.8"
                />
              </svg>
              <span className={styles.filter_text}>
                <span>Filter</span>
              </span>
            </div>
            <div
              className={styles.dropdown}
              style={{ display: visible == 0 ? "none" : "block" }}
            >
              <Dropdown
                values={values}
                setcurrState={setcurrState}
                setcurrCity={setcurrCity}
                setupcomingRides={setupcomingRides}
                setpastRides={setpastRides}
                setnearestRides={setnearestRides}
              />
            </div>
          </div>
        </div>
        <div className={styles.allstations}>
          {selected === 0 &&
            nearestRides.length >= 1 &&
            nearestRides.map((item, index) => {
              if (currState.length > 1 && currState == item.state)
                return <Blocks key={index} item={item} styles={styles} />;
              else if (currCity.length > 1 && currCity == item.city)
                return <Blocks key={index} item={item} styles={styles} />;
              else return <Blocks key={index} item={item} styles={styles} />;
            })}
          {selected === 1 &&
            upcomingRides.length >= 1 &&
            upcomingRides.map((item, index) => {
              if (currState.length > 1 && currState == item.state)
                return <Blocks key={index} item={item} styles={styles} />;
              else if (currCity.length > 1 && currCity == item.city)
                return <Blocks key={index} item={item} styles={styles} />;
              else return <Blocks key={index} item={item} styles={styles} />;
            })}
          {selected === 2 &&
            pastRides.length >= 1 &&
            pastRides.map((item, index) => {
              if (
                currState.length > 1 &&
                currState != item.state &&
                currCity !== item.city
              )
                return <div></div>;
              else return <Blocks key={index} item={item} styles={styles} />;
            })}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch("https://assessment.api.vweb.app/rides");
  const data = await response.json();
  const resp = await fetch("https://assessment.api.vweb.app/user");
  const user = await resp.json();
  let nearestRides = [],
    upcomingRides = [],
    pastRides = [];
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  data.map((item) => {
    const currmonth = parseInt(item.date.substr(0, 2));
    const currday = parseInt(item.date.substr(3, 2));
    const curryear = parseInt(item.date.substr(6));

    if (curryear == year && day == currday && currmonth == month) {
      nearestRides.push(item);
    } else if (
      curryear < year ||
      (year === curryear && month > currmonth) ||
      (year === curryear && month === currmonth && day > currday)
    ) {
      pastRides.push(item);
    } else {
      upcomingRides.push(item);
    }
  });
  return {
    props: {
      values: data,
      nRides: nearestRides,
      pRides: pastRides,
      uRides: upcomingRides,
      myProfile: user,
    },
  };
}
