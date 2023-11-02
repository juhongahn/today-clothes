export type RISESET = {
  locdate: number;
  sunrise: string;
  sunset: string;
};

export type Local = {
  region_type: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  code: string;
  x: string;
  y: string;
};

export type WEATHER = {
  dt: number;
  value: {
    [x: string]: string;
    TMX: string;
    TMN: string;
  };
};

export type UV = {
  dt: number;
  components: {
    uv: GRADE_OBJ;
  };
};

export type DUST = {
  dt: number;
  components: {
    co: GRADE_OBJ;
    no: number;
    no2: GRADE_OBJ;
    o3: GRADE_OBJ;
    so2: GRADE_OBJ;
    pm2_5: GRADE_OBJ;
    pm10: GRADE_OBJ;
    nh3: number;
  };
};

export type GRADE_OBJ = {
  grade: string;
  value: number;
};

export type COORDS = {
  latitude: number;
  longitude: number;
};
