import fs from 'fs';
import path from 'path';

const DUMP_PATH = __dirname + '/../dumps';

export function saveDump(
    dumpType: string,
    content: any,
    cPath: string = DUMP_PATH,
    infos: any = {},
  ) {
    fs.writeFileSync(
      getDumpPath(dumpType, cPath, infos),
      JSON.stringify(content),
    );
}
  
/**
 * Restore dump content as file
 * 
 * @param dumpType Type of dump which is used to resolve dump file name
 * @param cPath Location of saved dump file
 * @returns JSON object or undefined
 */
 export function loadDump(
    dumpType: string,
    cPath: string = DUMP_PATH,
  ) {
    const path = getDumpPath(dumpType, cPath);
    return fs.existsSync(path)
      ? JSON.parse(fs.readFileSync(path).toString())
      : undefined;
}
  
/**
 * Resolve dump file path from dumpType
 * 
 * @param dumpType Type of dump which is used to resolve dump file name
 * @param cPath Location of saved dump file
 * @param infos Optional param for track transactions. Save period info in the dump file name
 * @returns Location of subdirectory of exact dump file
 */
export function getDumpPath(
    dumpType: string,
    cPath: string = DUMP_PATH,
    infos: any = {},
) {
    if (!fs.existsSync(cPath)) fs.mkdirSync(cPath, {recursive: true});
    switch (dumpType) {
      default:
        return path.join(cPath, dumpType);
    }
}