import { BLANK, WALL, BOX, PLAYER, UP, DOWN, LEFT, RIGHT, parse_map, parse_moves } from "./util.mjs";
const draw_background = (ctx) => {
    ctx.fillStyle = "rgba(140, 140, 200, 0.5)";
    ctx.fillRect(0, 0, 800, 800);
};
const render = (ctx, state) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    draw_background(ctx);
    const px_per_cell = ctx.canvas.width / state.width;
    ctx.font = `${px_per_cell}px serif`;
    ctx.textAlign = "center";
    for (let i = 0; i < state.width; i++) {
        for (let j = 0; j < state.width; j++) {
            const next_char = state.map[i][j];
            switch (next_char) {
                case BOX: {
                    ctx.strokeStyle = "#DDDDDD";
                    ctx.strokeText(BOX, i * px_per_cell + px_per_cell / 2, j * px_per_cell + px_per_cell, px_per_cell);
                    break;
                }
                case WALL: {
                    ctx.strokeStyle = "#000000";
                    ctx.strokeText(WALL, i * px_per_cell + px_per_cell / 2, j * px_per_cell + px_per_cell, px_per_cell);
                    break;
                }
                case PLAYER: {
                    ctx.strokeStyle = "#000080";
                    ctx.strokeText(PLAYER, i * px_per_cell + px_per_cell / 2, j * px_per_cell + px_per_cell, px_per_cell);
                    break;
                }
            }
        }
    }
};
const move_box = (state, box_coord, next_move) => {
    const [bx, by] = box_coord;
    switch (next_move) {
        case UP: {
            if (state.map[bx][by - 1] === BOX) {
                move_box(state, [bx, by - 1], next_move);
            }
            if (state.map[bx][by - 1] === BLANK) {
                state.map[bx][by - 1] = BOX;
                state.map[bx][by] = ".";
            }
            break;
        }
        case DOWN: {
            if (state.map[bx][by + 1] === BOX) {
                move_box(state, [bx, by + 1], next_move);
            }
            if (state.map[bx][by + 1] === BLANK) {
                state.map[bx][by + 1] = BOX;
                state.map[bx][by] = ".";
            }
            break;
        }
        case LEFT: {
            if (state.map[bx - 1][by] === BOX) {
                move_box(state, [bx - 1, by], next_move);
            }
            if (state.map[bx - 1][by] === BLANK) {
                state.map[bx - 1][by] = BOX;
                state.map[bx][by] = ".";
            }
            break;
        }
        case RIGHT: {
            if (state.map[bx + 1][by] === BOX) {
                move_box(state, [bx + 1, by], next_move);
            }
            if (state.map[bx + 1][by] === BLANK) {
                state.map[bx + 1][by] = BOX;
                state.map[bx][by] = ".";
            }
            break;
        }
    }
};
const move_player = (state, next_move) => {
    const [px, py] = state.player_coord;
    switch (next_move) {
        case UP: {
            if (state.map[px][py - 1] === BOX) {
                move_box(state, [px, py - 1], next_move);
            }
            if (state.map[px][py - 1] === BLANK) {
                state.player_coord = [px, py - 1];
                state.map[px][py] = ".";
                state.map[px][py - 1] = PLAYER;
            }
            break;
        }
        case DOWN: {
            if (state.map[px][py + 1] === BOX) {
                move_box(state, [px, py + 1], next_move);
            }
            if (state.map[px][py + 1] === BLANK) {
                state.player_coord = [px, py + 1];
                state.map[px][py] = ".";
                state.map[px][py + 1] = PLAYER;
            }
            break;
        }
        case LEFT: {
            if (state.map[px - 1][py] === BOX) {
                move_box(state, [px - 1, py], next_move);
            }
            if (state.map[px - 1][py] === BLANK) {
                state.player_coord = [px - 1, py];
                state.map[px][py] = ".";
                state.map[px - 1][py] = PLAYER;
            }
            break;
        }
        case RIGHT: {
            if (state.map[px + 1][py] === BOX) {
                move_box(state, [px + 1, py], next_move);
            }
            if (state.map[px + 1][py] === BLANK) {
                state.player_coord = [px + 1, py];
                state.map[px][py] = ".";
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
            if (state.map[i][j] === BOX)
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
        moves_textfield.value = move_string;
    };
    document.body.insertAdjacentElement("beforeend", load_moves_btn);
})();
