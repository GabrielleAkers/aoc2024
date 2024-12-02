def parse_data(_l1: list[int], _l2: list[int]):
    with open("./data", "r", encoding="utf8") as f:
        t = f.readlines()
        for x in t:
            s = x.split("   ")
            _l1.append(int(s[0]))
            _l2.append(int(s[1]))


def part1():
    l1, l2 = [], []
    parse_data(l1, l2)

    l1.sort()
    l2.sort()

    diff = 0
    for i, l1v in enumerate(l1):
        diff += abs(l1v - l2[i])

    print("sum of diffs:", diff)


def part2():
    l1, l2, = [], []
    parse_data(l1, l2)

    sim_score = 0
    for x in l1:
        sim_score += x * l2.count(x)

    print("sim score:", sim_score)


if __name__ == "__main__":
    part1()
    part2()
