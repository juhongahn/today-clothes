export type Location = {
  location?: {
    latitude: number;
    longitude: number;
  };
  loaded: boolean;
  error?: string;
};

export type Riseset = {
  locdate: string[];
  sunrise: string[];
  sunset: string[];
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

export type Weather = {
  dt: number;
  value: {
    TMP: string;
    SKY: string;
    PTY: string;
    POP: string;
    REH: string;
    PCP: string;
    SNO: string;
    UUU: string;
    VEC: string;
    VVV: string;
    WAV: string;
    WSD: string;
    TMX?: string,
    TMN?: string,
  };
};

export type UV = {
  dt: number;
  components: { uv: GRADE_OBJ };
};

export type DUST = {
  dt: number;
  main: {
    aqi: number;
  };
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

export enum REQ_TYPE {
  WEATHER = "weather",
  UV = "uv",
  DUST = "dust",
  RISE_SET = "riseset",
}
