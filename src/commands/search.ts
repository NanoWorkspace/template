import querystring from "querystring"
import Command from "../app/Command"
import Embed from "../app/Embed"
import Types from "../utils/ArgumentTypes"

new Command({
  name: "Search Engine",
  pattern: /se?(?:arch)?/i,
  description: "Create a link to a search engine from your search.",
  args: {
    searchEngine: {
      defaultIndex: 0,
      type: [
        /google|ggl?/,
        /yandex|yd/,
        /wiki(?:p[ée]dia)?|wp/,
        /duckduckgo|ddg/,
        "bing",
        /youtube|yt/,
        /porn(?:hub)?|ph/,
      ],
    },
    search: { type: Types.rest },
  },
  call: async ({ message, args: { searchEngineIndex, search } }) => {
    if (!search)
      return await message.channel.send(
        Embed.error("Vous devez entrer une recherche...")
      )

    let baseUrl = "https://www.google.com/search"
    let key = "q"

    switch (searchEngineIndex) {
      case 1:
        baseUrl = "https://yandex.com/search/"
        key = "text"
        break
      case 2:
        baseUrl = "https://fr.wikipedia.org/w/index.php"
        key = "search"
        break
      case 3:
        baseUrl = "https://duckduckgo.com/"
        break
      case 4:
        baseUrl = "https://www.bing.com/search"
        break
      case 5:
        baseUrl = "https://www.youtube.com/results"
        key = "search_query"
        break
      case 6:
        baseUrl = "https://fr.pornhub.com/video/search"
        key = "search"
        break
    }

    const qs = querystring.stringify({
      [key]: search,
    })

    await message.channel.send(baseUrl + "?" + qs)
  },
})
