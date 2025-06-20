import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(userName: string) {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}

export function readConfig(): Config {
    const path = getConfigFilePath();
    const rawCfg = fs.readFileSync(path, "utf-8");
    const validCfg = validateConfig(JSON.parse(rawCfg));

    return validCfg;
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
    const path = getConfigFilePath();
    const rawCfg = {
            db_url: cfg.dbUrl,
            current_user_name: cfg.currentUserName,
    };

    const data = JSON.stringify(rawCfg, null, 2);
    fs.writeFileSync(path, data, { encoding: "utf-8" });
}

function validateConfig(rawCfg: any): Config {
    if (!rawCfg.db_url || typeof rawCfg.db_url !== "string") {
        throw new Error("db_url is required in the config file");
    }

    if (!rawCfg.current_user_name || typeof rawCfg.current_user_name !== "string") {
        throw new Error("current_user_name is required in the config file");
    }

    const cfg: Config = {
        dbUrl: rawCfg.db_url,
        currentUserName: rawCfg.current_user_name,
    };
    return cfg;
}