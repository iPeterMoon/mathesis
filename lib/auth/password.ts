import { genSaltSync, hashSync, compareSync } from "bcrypt";

export const encode = (str: string) => {
    const salt = genSaltSync(10);
    return hashSync(str, salt);
};

export const compare = (str: string, hash: string) => {
    return compareSync(str, hash);
}