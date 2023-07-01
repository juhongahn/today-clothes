"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported");
    }
  };
  fetchLocation()
  // useEffect(() => {
  //   const fetchLocation = () => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           setLatitude(position.coords.latitude);
  //           setLongitude(position.coords.longitude);
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //         }
  //       );
  //     } else {
  //       console.error("Geolocation is not supported");
  //     }
  //   };

  //   fetchLocation();
  // }, []);

  return (
    <div>
      Latitude: {latitude}
      <br />
      Longitude: {longitude}
    </div>
  );
}

function getGeoLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
