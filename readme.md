# config utility

This little utility allows the addition of a _dev.json_ configuration file in the    
_./.vscode_ folder.
 
The lib reads configuration data from `/.vscode/dev.json`.

If a dev.json file is not found, a default file is created in the /.vscode folder

If the dev.json does not include a named Config object for the name given, one will be added.

Each client application will supply their own default configuration.   
If an app is started with command line args, these will replace the same members in any existing cfg or will modify the default cfg before creating a new entry in the dev.json file.   

A Config type has the following optional members:
```ts
export type Config = {
   FileName?: string       /* the name of a file to run */
   TargetFolder?: string   /* the folder to run or serve from */
   BuildTarget?: string    /* the folder to place the build bundle in */
   Watch?: string[]        /* Array of folders to watch for changes in. (to trigger a build) */
   Port?: number           /* a port number for the server or a service to use*/
   HotPort?: number        /* the SSE port number for HotServer to use */
   CWD?: string            /* current working directory */
   Out?: string            /* the folder to place esBuild bundle.js in */
   Entry?: string[]        /* an array of entry files to start esBuild from */
   Minify?: boolean        /* minify the esbuild bundle? */
}
```
As each of the members in this type are optional, each named-config (app) may use any.

For example, a "simple" config (SimpleServer), uses only 'TargetFolder, and 'Port'.   
The `dev.json` in `./.vscode` will look like:
```ts
{
   "simple": {
      "DEV": true,
      "Port": 80,
      "Serve": ""
   },
}
```
Typing `serve` at the command line, will then serve ./index.html from localhost:80.
     
Typing `serve dist 8080` at the command line, will first change the values in the dev.json file, then serve ./dist/index.html from localhost:8080.
 
Typing `serve` again will use the new cfg values to serve ./dist/index.html from localhost:8080.