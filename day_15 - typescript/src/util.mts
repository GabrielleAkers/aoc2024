export const WALL = "#";
export const BOX = "O";
export const BLANK = ".";
export const PLAYER = "@";

export const parse_map = async () => {
  const data = await (await fetch(new URL("../data/map", document.baseURI).href)).text();
  const map_data = {
    width: 0,
    map: [] as string[][],
    player_coord: [0, 0],
    wall_coords: [] as [number, number][],
    box_coords: [] as [number, number][]
  };
  const lines = data.split(/\r?\n/);
  // assuming its square
  map_data.width = lines[0].length;
  for (let i = 0; i < map_data.width; i++) {
    map_data.map.push([]);
    for (let j = 0; j < map_data.width; j++) {
      const next_char = lines[j][i];
      map_data.map[i].push(next_char);
      if (next_char === WALL)
        map_data.wall_coords.push([i, j]);
      else if (next_char === BOX)
        map_data.box_coords.push([i, j]);
      else if (next_char === PLAYER)
        map_data.player_coord = [i, j];
      else if (next_char === BLANK)
        continue;
      else
        console.warn(`found unknown character ${next_char} at [${i}, ${j}]`);
    }
  }
  return map_data;
};

export type MapData = Awaited<ReturnType<typeof parse_map>>;

export const UP = "^";
export const DOWN = "v";
export const LEFT = "<";
export const RIGHT = ">";

export const parse_moves = async () => {
  const data = await (await fetch(new URL("../data/moves", document.baseURI).href)).text();
  const lines = data.split(/\r?\n/);
  return lines.join("");
};
