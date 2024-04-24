export const getAssetsImage = (name: string) => {
    return new URL(`/src/assets/${name}`, import.meta.url).href
  }