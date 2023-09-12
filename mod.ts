
import type { Config } from './types.ts'
import { getCfgObj, persistCfg, unpackArgs } from './utils.ts'


/**
 *  getConfig async function
 *  @param {string} name - the name of the configuration object
 *  @param {string[]} args - any cli args
 *  @param {Config} defaultCfg - an optional default Config 
 *  @returns Promise\<ConfigYML\>
 */
function getConfig(name: string, args: string[], defaultCfg: Config): Config {


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

export {
   Config,
   getConfig
}