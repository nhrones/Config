import { getConfig } from "./index.ts";
console.log("Arg 0:", Bun.argv[0]);
console.log("Arg 1:", Bun.argv[1]);
console.log("Arg 2:", Bun.argv.slice(2));
let cfg
try {
   cfg = await getConfig("simple", Bun.argv.slice(2), { Serve: "./dist", Port: 8080 });
} catch (e: any) {
   console.info(e)
}
console.log('Doit! ', cfg)
console.log('Done!')