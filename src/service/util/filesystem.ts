import type { PathLike } from "node:fs";
import { access, constants } from "node:fs/promises";

export async function fileExists(path: PathLike) {
    try {
        await access(path, constants.F_OK)
        return true
    } catch {
        return false
    }
}
