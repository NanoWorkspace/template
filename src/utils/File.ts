import fs from "fs"
import path from "path"

export async function forEachFile(
  dirPaths: string[],
  fn: (path: string) => any,
  ignore?: RegExp
) {
  for (const dirPath of dirPaths) {
    const dir = await fs.promises.readdir(dirPath)
    for (const filename of dir) {
      if (ignore && ignore.test(filename)) continue
      const filePath = path.join(dirPath, filename)
      const stat = await fs.promises.stat(filePath)
      if (stat.isDirectory()) {
        await forEachFile([filePath], fn)
      } else {
        await fn(filePath)
      }
    }
  }
}

const File = {
  forEachFile,
}

export default File
