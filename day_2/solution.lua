local parse_data = function()
    local records = {}
    for line in io.lines("./data") do
        local levels = {}
        for level in line:gmatch("%d+") do
            table.insert(levels, tonumber(level))
        end
        table.insert(records, levels)
    end
    return records
end

local is_safe = function(record)
    -- check if monotone increasing or decreasing
    -- records always contain at least 2 records
    local inc = false
    if record[1] == record[2] then
        return "change less than 1"
    elseif math.abs(record[1] - record[2]) > 3 then
        return "change greater than 3"
    elseif record[1] > record[2] then
        inc = false
    else
        inc = true
    end
    for i=1, #record-1 do
        if record[i] == record[i+1] then
            return "change less than 1"
        elseif math.abs(record[i] - record[i+1]) > 3 then
            return "change greater than 3"
        end
        if inc then
            if record[i] > record[i+1] then
                return "decrease in increasing function"
            end
        else
            if record[i] < record[i+1] then
                return "increase in decreasing function"
            end
        end
    end
    return true
end

local part1 = function()
    local records = parse_data()
    local num_safe = 0
    for i, record in ipairs(records) do
        local checker = is_safe(record)
        if checker == true then
            num_safe = num_safe + 1
        else
            print("failure on level: " .. i)
            print(checker)
            print("--")
        end
    end
    print("total safe: " .. num_safe .. "\n")
end

local unpack = unpack or table.unpack

local part2 = function()
    local records = parse_data()
    local num_safe = 0
    for i, record in ipairs(records) do
        local checker = is_safe(record)
        if checker == true then
            num_safe = num_safe + 1
        else
            print("failure on level: " .. i)
            print(checker)
            for j=1,#record do
                print("trying to remove idx " .. j)
                local no_idx = {unpack(record)}
                table.remove(no_idx, j)
                local no_idx_checker = is_safe(no_idx)
                if no_idx_checker == true then
                    num_safe = num_safe + 1
                    print("that worked")
                    goto next_record
                else
                    print(no_idx_checker)
                end
            end
            ::next_record::
            print("--")
        end
    end
    print("total safe: " .. num_safe .. "\n")
end

part1()
part2()