export const code = (text: string, lang: string = "js") => {
  return "```" + lang + "\n" + text + "\n```"
}

export function improvePattern(pattern: RegExp): RegExp {
  return new RegExp(`^(?:${pattern.source})(?:\\s+|$)`, pattern.flags)
}

export default {
  improvePattern,
  code,
}
