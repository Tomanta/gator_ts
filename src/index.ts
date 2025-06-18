import { readConfig, setUser } from "./config.js";

function main() {
    setUser("Brian");
    const cfg = readConfig();
    console.log(cfg);

}

main();