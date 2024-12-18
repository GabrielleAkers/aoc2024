import { BLANK, WALL, BOX_L, BOX_R, PLAYER, UP, DOWN, LEFT, RIGHT, parse_map, parse_moves } from "./util.mjs";
const draw_background = (ctx) => {
    ctx.fillStyle = "rgba(140, 140, 200, 0.5)";
    ctx.fillRect(0, 0, 800, 800);
};
const render = (ctx, state) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    draw_background(ctx);
    const w_px_per_cell = ctx.canvas.width / state.width;
    const h_px_per_cell = ctx.canvas.height / state.height;
    ctx.font = `${w_px_per_cell}px serif`;
    ctx.textAlign = "center";
    for (let i = 0; i < state.width; i++) {
        for (let j = 0; j < state.height; j++) {
            const next_char = state.map[i][j];
            switch (next_char) {
                case BOX_L: {
                    ctx.strokeStyle = "#DDDDDD";
                    ctx.strokeText(BOX_L, i * w_px_per_cell + w_px_per_cell / 2, j * h_px_per_cell + h_px_per_cell / 2, w_px_per_cell);
                    break;
                }
                case BOX_R: {
                    ctx.strokeStyle = "#DDDDDD";
                    ctx.strokeText(BOX_R, i * w_px_per_cell + w_px_per_cell / 2, j * h_px_per_cell + h_px_per_cell / 2, w_px_per_cell);
                    break;
                }
                case WALL: {
                    ctx.strokeStyle = "#000000";
                    ctx.strokeText(WALL, i * w_px_per_cell + w_px_per_cell / 2, j * h_px_per_cell + h_px_per_cell / 2, w_px_per_cell);
                    break;
                }
                case PLAYER: {
                    ctx.strokeStyle = "#000080";
                    ctx.strokeText(PLAYER, i * w_px_per_cell + w_px_per_cell / 2, j * h_px_per_cell + h_px_per_cell / 2, w_px_per_cell);
                    break;
                }
            }
        }
    }
};
const check_move_box_updown = (state, box_coord, next_move) => {
    let [bx, by] = box_coord;
    if (state.map[bx][by] === BOX_R)
        bx -= 1;
    switch (next_move) {
        case UP: {
            const up_tile_left = state.map[bx][by - 1];
            const up_tile_right = state.map[bx + 1][by - 1];
            if (up_tile_left === WALL || up_tile_right === WALL)
                return false;
            if (up_tile_left === BOX_L || up_tile_left === BOX_R) {
                if (!check_move_box_updown(state, [bx, by - 1], next_move))
                    return false;
            }
            if (up_tile_right === BOX_L) {
                if (!check_move_box_updown(state, [bx + 1, by - 1], next_move))
                    return false;
            }
            return true;
        }
        case DOWN: {
            const down_tile_left = state.map[bx][by + 1];
            const down_tile_right = state.map[bx + 1][by + 1];
            if (down_tile_left === WALL || down_tile_right === WALL)
                return false;
            if (down_tile_left === BOX_L || down_tile_left === BOX_R) {
                if (!check_move_box_updown(state, [bx, by + 1], next_move))
                    return false;
            }
            if (down_tile_right === BOX_L) {
                if (!check_move_box_updown(state, [bx + 1, by + 1], next_move))
                    return false;
            }
            return true;
        }
        default: {
            return false;
        }
    }
};
const move_box = (state, box_coord, next_move) => {
    let [bx, by] = box_coord;
    switch (next_move) {
        case UP: {
            if (state.map[bx][by] === BOX_R)
                bx -= 1;
            const up_tile_left = state.map[bx][by - 1];
            const up_tile_right = state.map[bx + 1][by - 1];
            if (up_tile_left === BOX_L)
                move_box(state, [bx, by - 1], next_move);
            if (up_tile_left === BOX_R)
                move_box(state, [bx, by - 1], next_move);
            if (up_tile_right === BOX_L)
                move_box(state, [bx + 1, by - 1], next_move);
            state.map[bx][by] = BLANK;
            state.map[bx + 1][by] = BLANK;
            state.map[bx][by - 1] = BOX_L;
            state.map[bx + 1][by - 1] = BOX_R;
            break;
        }
        case DOWN: {
            if (state.map[bx][by] === BOX_R)
                bx -= 1;
            const down_tile_left = state.map[bx][by + 1];
            const down_tile_right = state.map[bx + 1][by + 1];
            if (down_tile_left === BOX_L)
                move_box(state, [bx, by + 1], next_move);
            if (down_tile_left === BOX_R)
                move_box(state, [bx, by + 1], next_move);
            if (down_tile_right === BOX_L)
                move_box(state, [bx + 1, by + 1], next_move);
            state.map[bx][by] = BLANK;
            state.map[bx + 1][by] = BLANK;
            state.map[bx][by + 1] = BOX_L;
            state.map[bx + 1][by + 1] = BOX_R;
            break;
        }
        case LEFT: {
            if (state.map[bx - 2][by] === BOX_R) {
                // [][] < good
                move_box(state, [bx - 2, by], next_move);
            }
            if (state.map[bx - 2][by] === BLANK) {
                // .[] < good
                state.map[bx - 2][by] = BOX_L;
                state.map[bx - 1][by] = BOX_R;
                state.map[bx][by] = BLANK;
            }
            // #[] < bad
            break;
        }
        case RIGHT: {
            if (state.map[bx + 2][by] === BOX_L) {
                // [][] < good
                move_box(state, [bx + 2, by], next_move);
            }
            if (state.map[bx + 2][by] === BLANK) {
                // []. < good
                state.map[bx + 2][by] = BOX_R;
                state.map[bx + 1][by] = BOX_L;
                state.map[bx][by] = BLANK;
            }
            // []# < bad
            break;
        }
    }
};
const move_player = (state, next_move) => {
    const [px, py] = state.player_coord;
    switch (next_move) {
        case UP: {
            if (state.map[px][py - 1] === WALL) {
                return;
            }
            if (state.map[px][py - 1] === BLANK) {
                state.player_coord = [px, py - 1];
                state.map[px][py] = BLANK;
                state.map[px][py - 1] = PLAYER;
                return;
            }
            if (!check_move_box_updown(state, [px, py - 1], next_move))
                return;
            move_box(state, [px, py - 1], next_move);
            state.player_coord = [px, py - 1];
            state.map[px][py] = BLANK;
            state.map[px][py - 1] = PLAYER;
            break;
        }
        case DOWN: {
            if (state.map[px][py + 1] === WALL) {
                return;
            }
            if (state.map[px][py + 1] === BLANK) {
                state.player_coord = [px, py + 1];
                state.map[px][py] = BLANK;
                state.map[px][py + 1] = PLAYER;
                return;
            }
            if (!check_move_box_updown(state, [px, py + 1], next_move))
                return;
            move_box(state, [px, py + 1], next_move);
            state.player_coord = [px, py + 1];
            state.map[px][py] = BLANK;
            state.map[px][py + 1] = PLAYER;
            break;
        }
        case LEFT: {
            if (state.map[px - 1][py] === BOX_R) {
                move_box(state, [px - 1, py], next_move);
            }
            if (state.map[px - 1][py] === BLANK) {
                state.player_coord = [px - 1, py];
                state.map[px][py] = BLANK;
                state.map[px - 1][py] = PLAYER;
            }
            break;
        }
        case RIGHT: {
            if (state.map[px + 1][py] === BOX_L) {
                move_box(state, [px + 1, py], next_move);
            }
            if (state.map[px + 1][py] === BLANK) {
                state.player_coord = [px + 1, py];
                state.map[px][py] = BLANK;
                state.map[px + 1][py] = PLAYER;
            }
            break;
        }
    }
};
const calc_score = (state) => {
    let score = 0;
    for (let i = 0; i < state.width; i++) {
        for (let j = 0; j < state.width; j++) {
            if (state.map[i][j] === BOX_L)
                score += (100 * j + i);
        }
    }
    return score;
};
(async () => {
    const game_canvas = document.getElementById("game_canvas");
    if (!game_canvas)
        throw new Error("No game_canvas found");
    const ctx = game_canvas.getContext("2d");
    if (!ctx)
        throw new Error("Canvas 2d ctx not supported");
    const footer = document.getElementById("footer");
    if (!footer)
        throw new Error("NO FOOTER!?!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    footer.style.color = "white";
    const container = document.createElement("div");
    container.style.display = "flex";
    const btn_grid = document.createElement("div");
    btn_grid.style.display = "grid";
    btn_grid.style.width = "80px";
    btn_grid.style.gridTemplateColumns = "80px";
    btn_grid.style.color = "white";
    btn_grid.style.textAlign = "center";
    container.appendChild(btn_grid);
    let moves = [];
    const moves_textfield = document.createElement("textarea");
    moves_textfield.oninput = (evt) => {
        // @ts-ignore
        const _txt = evt.target.value;
        moves = _txt.split("").filter(val => (val === UP || val === DOWN || val === LEFT || val === RIGHT));
        moves_textfield.value = moves.join("");
    };
    container.appendChild(moves_textfield);
    document.body.insertAdjacentElement("afterbegin", container);
    [UP, DOWN, LEFT, RIGHT].forEach(dir => {
        const btn = document.createElement("button");
        btn.innerText = dir;
        btn.onclick = (evt) => {
            evt.preventDefault();
            moves.push(dir);
            moves_textfield.value += dir;
        };
        btn_grid.appendChild(btn);
    });
    const state = await parse_map();
    // change step_time to like 250 to see steps more clearly
    const step_time = 5;
    const loop = (timestamp) => {
        if (!started) {
            return;
        }
        const next_move = moves.shift();
        moves_textfield.value = moves.join("");
        if (next_move) {
            move_player(state, next_move);
            render(ctx, state);
        }
        else {
            const score = calc_score(state);
            footer.innerHTML = `BIG SCORE! ${score}`;
            console.log("score is ", score);
        }
        frame_ids.forEach(id => window.cancelAnimationFrame(id));
        const do_loop = () => {
            frame_ids.push(window.requestAnimationFrame(loop));
        };
        setTimeout(do_loop, step_time);
    };
    render(ctx, state);
    window.requestAnimationFrame(loop);
    const frame_ids = [];
    let started = false;
    moves_textfield.readOnly = started;
    const start_button = document.createElement("button");
    start_button.innerText = started ? "STOP" : "Gogogogo";
    start_button.style.width = "80px";
    start_button.onclick = (evt) => {
        evt.preventDefault();
        frame_ids.forEach(id => window.cancelAnimationFrame(id));
        started = !started;
        start_button.innerText = started ? "STOP" : "Gogogogo";
        moves_textfield.readOnly = started;
        frame_ids.push(window.requestAnimationFrame(loop));
    };
    document.body.insertAdjacentElement("beforeend", start_button);
    const load_moves_btn = document.createElement("button");
    load_moves_btn.innerText = "LOAD MOVES";
    load_moves_btn.onclick = async (evt) => {
        evt.preventDefault();
        const move_string = await parse_moves();
        moves = move_string.split("").filter(val => (val === UP || val === DOWN || val === LEFT || val === RIGHT));
        moves_textfield.value = moves.join("");
    };
    document.body.insertAdjacentElement("beforeend", load_moves_btn);
})();
