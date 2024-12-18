export const WALL = "#";
export const BOX_L = "[";
export const BOX_R = "]";
export const BLANK = ".";
export const PLAYER = "@";

export const parse_map = async () => {
    const data = await (await fetch(new URL("data/map", window.location.href).href)).text();
    const map_data = {
        width: 0,
        height: 0,
        map: [] as string[][],
        player_coord: [0, 0],
    };
    const lines = data.split(/\r?\n/);
    // assuming its 2:1 ratio
    map_data.width = lines[0].length;
    map_data.height = lines.length - 1;
    for (let i = 0; i < map_data.width; i++) {
        map_data.map.push([]);
        for (let j = 0; j < map_data.height; j++) {
            const next_char = lines[j][i];
            map_data.map[i].push(next_char);
            if (next_char === PLAYER)
                map_data.player_coord = [i, j];
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
    const data = await (await fetch(new URL("data/moves", window.location.href).href)).text();
    const lines = data.split(/\r?\n/);
    return lines.join("");
};
