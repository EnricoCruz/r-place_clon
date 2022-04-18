// Data packets
export interface IPixelSimpleData {
    id: number;
    // x: number,
    // y: number,
    color: string;
}

export interface IPixelCoordsData {
    x: number,
    y: number,
    color: string
    n?: number,
}
