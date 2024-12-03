import fs from "fs";

function part1() {
    function parse_data() {
        const file = fs.readFileSync("./data", { encoding: "utf-8" });
        const matched_data = file.match(/mul\([0-9]+,[0-9]+\)/g);
        const parsed = [];
        matched_data.forEach(m => {
            parsed.push(m.replace("mul(", "").replace(")", "").split(","));
        })
        parsed.forEach(arr => {
            arr[0] = Number(arr[0]);
            arr[1] = Number(arr[1]);
        })
        return parsed;
    }
    const data = parse_data();
    let result = 0;
    data.forEach(arr => {
        result += arr[0] * arr[1];
    })
    console.log(result);
}

function part2() {
    function parse_data() {
        const file = fs.readFileSync("./data", { encoding: "utf-8" });
        // could do this with a fancy negative lookahead regex but why bother
        const matched_data = file.match(/do\(\)|(mul\([0-9]+,[0-9]+\))|don't\(\)/g);
        console.log(matched_data);
        const dothese = [];
        let do_enabled = true;
        matched_data.forEach(m => {
            if (m == "do()") {
                do_enabled = true;
            } else if (m == "don't()") {
                do_enabled = false;
            }
            if (m !== "do()" && m !== "don't()") {
                if (do_enabled) {
                    dothese.push(m);
                }
            }
        });
        const parsed = [];
        dothese.forEach(m => {
            parsed.push(m.replace("mul(", "").replace(")", "").split(","));
        })
        parsed.forEach(arr => {
            arr[0] = Number(arr[0]);
            arr[1] = Number(arr[1]);
        })
        return parsed;
    }
    const data = parse_data();
    let result = 0;
    data.forEach(arr => {
        result += arr[0] * arr[1];
    })
    console.log(result);
}

part1();
part2();