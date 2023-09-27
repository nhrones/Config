// deno-lint-ignore-file no-explicit-any
import { join } from "https://deno.land/std@0.201.0/path/mod.ts";

export type Config = {
   FileName?: string       /* the name of a file to run */
   TargetFolder?: string   /* the folder to run or serve from */
   BuildTarget?: string    /* the folder to place the build bundle in */
   Watch?: string          /* a folder to watch for changes in. (to trigger a build) */
   Port?: number           /* a port number for the server or a service to use*/
   HotPort?: number        /* the SSE port number for HotServer to use */
   CWD?: string            /* current working directory */
   Out?: string            /* the file name for the esBuild output */
   Entry?: string[]        /* an array of entry files to start esBuild from */
   Minify?: boolean        /* minify the esbuild bundle? */
}

/** The full path for the dev.json configuration file */
const CfgFilePath = "./.vscode/dev.json"

/** A default configuration file */
export const DefaultCFG = {
   FileName: "mod.ts",
   BuildTarget: "dist",
   Watch: "src",
   Port: 80,
   HotPort: 9001,
   CWD: "",
   Minify: false
}

/** getConfig async function
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} args - any cli args
 *  @param {Config} defaultCfg - an optional default Config 
 *  @returns Promise\<ConfigYML\>
 */
export function getConfig(
   name: string,
   args: string[],
   defaultCfg: Config
): Config {

   // get any existing cfg from dev.json
   const devCfg = getCfgObj()

   // first find existing cfg, else use passed in defaultCfg
   const thisNamedCfg = (name in devCfg)
      ? devCfg[name]
      : defaultCfg

   // adjust thisCfg with any passed in args - args are priority
   const thisNewCfg = (args.length)
      ? unpackArgs(args, thisNamedCfg) // mutate defaults with any cli-args
      : thisNamedCfg

   // correct any 'root' value
   if (thisNewCfg.targetFolder && thisNewCfg.targetFolder === 'root') {
      thisNewCfg.targetFolder = ""
   }

   // save it
   persistCfg(name, thisNewCfg)

   // send it
   return thisNewCfg
}

/** Does dev.json file exist */
function cfgFileExists() {
   try {
      const result = Deno.statSync(CfgFilePath)
      return (result.isFile)
   } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
         return false
      } else {
         throw e
      }
   }
}

/** Args are expected in defaultCfg-order where all are optional. */
function unpackArgs(args: string[], defaultCfg: any): Config {
   // marry args to cfg values
   const cfgKeys = Array.from(Object.keys(defaultCfg))
   cfgKeys.forEach((element, index) => {
      if (args[index]) {
         let arg = args[index]
         if (arg === 'root') arg = ''
         defaultCfg[element] = arg
      } else {
         if (defaultCfg[element] === 'root') defaultCfg[element] === ''
      }
   })
   return defaultCfg
}

/** Get raw configuration object from 'dev.json' */
function getCfgObj() {
   // start as empty object
   let rawCfg: Record<string, any> = {}
   // get the existing dev.json object
   if (cfgFileExists()) {
      // Unpack dev.json file
      rawCfg = JSON.parse(Deno.readTextFileSync(CfgFilePath));
   }
   // return it
   return rawCfg
}

/** Write a named configuration to the dev.json file */
async function persistCfg(name: string, thisNamedCfg: any) {
   // get all
   const config: Record<string, any> = getCfgObj() 
   // add or modify this named config
   config[name] = thisNamedCfg
   await Deno.mkdir(join(".", ".vscode"), { recursive: true });
   // write all
   Deno.writeTextFileSync(CfgFilePath, JSON.stringify(config, null, 3));
}
