export type Character = {
    type: string; // Tipo del personaje (por ejemplo: "troll")
    orientation: string; // Orientación del personaje (por ejemplo: "down")
    id: string; // Identificador único del personaje
};
  
export type Item = {
    type: string; // Tipo del ítem (por ejemplo: "fruit")
    id: string; // Identificador único del ítem
};
  
export type BoardCell = {
    x: number; // Coordenada X de la celda
    y: number; // Coordenada Y de la celda
    item: Item | null; // El ítem en la celda, puede ser null si no hay ítem
    character: Character | null; // El personaje en la celda, puede ser null si no hay personaje
};