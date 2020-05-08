import { Coordinates } from './coordinates';
import { Pilot } from './pilot';

export interface XWing {
    id: number;
    coordinates: Coordinates;
    cost: number;
    health: number;
    name: string;
    pilot: Pilot;
}
