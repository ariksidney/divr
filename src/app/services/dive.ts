export interface Dive {
    details: DiveDetails;
    waypoints: Waypoint[];
}

export interface DiveDetails {
    avgDepth: number;
    current: string;
    duration: number;
    greatestDepth: number;
    startTime: Date;
    surfaceIntervalBeforeDive?: number;
    diveSite?: DiveSite;
}

export interface Waypoint {
    depth: number;
    divetime: number;
    temperature: number;
}

export interface DiveSite {
    name: string;
    location?: string;
    country?: string;
    lat?: number;
    long?: number;
}
