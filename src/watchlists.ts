import fs from "fs"
import Papa from "papaparse"
import path from "path"
import { except } from "./util/except"
import { intersection } from "./util/intersection"
import { union } from "./util/union"

const WATCHLIST_FOLDER = "./watchlists"
const WATCHED_FOLDER = "./watched"
const URI_KEY = "Letterboxd URI"

const FILMS_DICT: any = {}

// ---------------------------------------------

async function parseCsv(filePath: string): Promise<any[]> {
  const csv = fs.readFileSync(filePath, "utf-8")
  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      complete: function (results) {
        const nonEmpty = results.data.filter((row: any) => {
          let empty = true
          results.meta.fields?.forEach((field) => {
            if (row[field]) empty = false
          })
          return !empty
        })
        resolve(nonEmpty)
      }
    })
  })
}

function getFiles(folderPath: string) {
  const files = fs.readdirSync(folderPath)
  return files.map((filePath) => {
    return path.resolve(folderPath, filePath)
  })
}

async function getWatchlists() {
  const files = getFiles(WATCHLIST_FOLDER)
  const watchlists = await Promise.all(files.map((file) => parseCsv(file)))
  await Promise.all(watchlists.map((wl) => populateFilmsDict(wl)))
  return watchlists
}

async function getWatcheds() {
  const files = getFiles(WATCHED_FOLDER)
  const watcheds = await Promise.all(files.map((file) => parseCsv(file)))
  await Promise.all(watcheds.map((wl) => populateFilmsDict(wl)))
  return watcheds
}

function populateFilmsDict(films: any[]) {
  films.forEach((film) => {
    FILMS_DICT[film[URI_KEY]] = film
  })
}

function convertUrisToFilms(uris: string[]) {
  return uris.map((uri) => FILMS_DICT[uri])
}
function convertFilmsToUris(films: any[]): string[] {
  return films.map((film) => film[URI_KEY])
}

// ------------------------------------

export async function watchlists() {
  const watchlistsIntersection = convertUrisToFilms(
    intersection((await getWatchlists()).map(convertFilmsToUris))
  )
  const watchlistsUnion = convertUrisToFilms(
    union((await getWatchlists()).map(convertFilmsToUris))
  )
  const watchedsUnion = convertUrisToFilms(
    union((await getWatcheds()).map(convertFilmsToUris))
  )
  const watchlistsExceptWatcheds = convertUrisToFilms(
    except(
      convertFilmsToUris(watchlistsUnion),
      convertFilmsToUris(watchedsUnion)
    )
  )

  console.log(watchlistsExceptWatcheds)
}
