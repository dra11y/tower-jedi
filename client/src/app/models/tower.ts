import { Coordinates } from './coordinates';
import { XWing } from './xwing';

export interface Tower {
    id: number;
    coordinates: Coordinates;
    cost: number;
    health: number;
    sector: string;
    target: XWing;
    is_destroyed: boolean;
}
