import {join} from './deps.ts'
import type { Config } from './types.ts'
import { CfgFilePath } from './constants.ts'

/**
 *  Does dev.json file exist
 */
export function cfgFileExists() {
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

/** 
 * Args are expected in defaultCfg-order where all are optional. 
 */
export function unpackArgs(args: string[], defaultCfg: any): Config {
   // marry args to cfg values
   let cfgKeys = Array.from(Object.keys(defaultCfg))
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

/**
 * Get raw configuration object from 'dev.json'
 */
export function getCfgObj() {
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

/** 
 *  Write a named configuration to the dev.json file 
 */
export async function persistCfg(name: string, thisNamedCfg: any) {
   // get all
   let config: Record<string, any> = getCfgObj()
   
   // add or modify this named config
   config[name] = thisNamedCfg
   await Deno.mkdir(join(".", ".vscode"), { recursive: true });

   // write all
   Deno.writeTextFileSync(CfgFilePath, JSON.stringify(config, null, 3));
}