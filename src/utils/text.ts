export const code = (text: string, lang: string = "js") => {
  return "```" + lang + "\n" + text + "\n```"
}

export default {
  code,
}
