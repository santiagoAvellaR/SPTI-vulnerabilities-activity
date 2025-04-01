export type Position = {
    x: number;
    y: number;
};

export type Entity = {
    type: string;
    subtype?: string;
    id?: string;
    position: Position;
};

export type BoardData = {
    size: { rows: number; cols: number };
    entities: Entity[];
};