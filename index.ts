

export type Config = {
   /** file name for the build bundle */
   BundleName?: string;
   /** current working directory */
   CWD?: string;
   /** a boolean flag used to enable logging or ? */
   DEV?: boolean;
   /** an array of entry files to start esBuild from */
   Entry?: string[];
   /** minify the esbuild bundle? */
   Minify?: boolean;
   /** esbuild outfile */
   Out?: string;
   /** a port number for the server or a service to use*/
   Port?: number;
   /** the folder to serve index.html from */
   Serve?: string;
   /** Array of folders to watch for changes in. (to trigger a build) */
   Watch?: string[];
}

/** The full path for the dev.json configuration file */
const CfgFilePath = "./.vscode/dev.json";

/** A default configuration file */
export const DefaultCFG: Config = {
   BundleName: "",
   CWD: "",
   DEV: true,
   Minify: false,
   Out: "dist",
   Port: 80,
   Serve: "",
   Watch: ["src"],
} as Config;

/** getConfig async function
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} args - any cli args
 *  @param {Config} defaultCfg - an optional default Config 
 *  @returns Promise\<any\>
 */
export async function getConfig(
   name: string,
   args: string[],
   defaultCfg: Config
): Promise<Config> {
   // get any existing cfg from ./.vscode/dev.json
   const devCfg = await getCfgObj();
   // first find existing cfg, else use passed in defaultCfg
   const thisNamedCfg: Config = (name in devCfg)
   //@ts-ignore
      ? devCfg[name]
      : defaultCfg; 

   // adjust thisCfg with any passed in args - args take priority
   const thisNewCfg = (args.length)
      ? unpackArgs(args, thisNamedCfg) // mutate defaults with any cli-args
      : thisNamedCfg;

   // save it
   persistCfg(name, thisNewCfg);

   // send it
   return Promise.resolve(thisNewCfg);
}

/** Args are expected in defaultCfg-order where all are optional. */
function unpackArgs(args: string[], defaultCfg: Config): Config {
   // marry args to cfg values
   const cfgKeys = Array.from(Object.keys(defaultCfg));
   cfgKeys.forEach((element, index) => {
      if (args[index]) {
         let arg = args[index];
         if (arg === 'root') arg = '';
         //@ts-ignore
         defaultCfg[element] = arg;
      }
   })
   return defaultCfg;
}

/** Get raw configuration object from 'dev.json' */
async function getCfgObj(): Promise<Config> {
   // start as empty object
   let rawCfg: Config = {};
   // get the existing dev.json object
   const file = Bun.file(CfgFilePath);
   if (await file.exists()) {
      // Unpack dev.json file
      rawCfg = await file.json(); 
   };
   // return it
   return rawCfg;
}

/** Write a named configuration to the dev.json file */
async function persistCfg(name: string, thisNamedCfg: any) {
   // get all
   const cfg: Config = await getCfgObj();
   // add or modify this named config
   //@ts-ignore
   cfg[name] = thisNamedCfg;
   const cfgString = JSON.stringify(cfg,null,4)
   // write all
   await Bun.write(CfgFilePath, cfgString, {createPath: true});
}
