import { useState } from "react";

function Blocks({ item, styles }) {
  return (
    <div className={styles.stations}>
      <div>
        <img src={item.map_url} />
      </div>
      <div className={styles.station_data}>
        <div>
          Ride Id:<span> {item.id}</span>
        </div>
        <div>
          Origin State:<span> {item.origin_station_code}</span>
        </div>
        <div>
          station_path: [
          <span>
            {item.station_path.map((val, index) => {
              if (index !== item.station_path.length - 1)
                return <span key={index}>{val},</span>;
              else return <span key={index}>{val}</span>;
            })}
          </span>
          ]
        </div>
        <div>
          Date:<span> {item.date}</span>
        </div>
        <div>
          Distance: <span>{item.origin_station_code}</span>
        </div>
      </div>
      <div className={styles.topside}>
        <div>{item.state}</div>
        <div>{item.city}</div>
      </div>
    </div>
  );
}

export default Blocks;
