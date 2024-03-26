import { generate } from "otp-generator"

export const generateMagicLink = (id: string) => {
  const domain = ""
  const timestampString = String(Date.now());
  const stringToInsert = generate(10, {
    upperCaseAlphabets: false,
    specialChars: false,
    digits: false
  })
  const insertionIndex = Math.floor(timestampString.length / 2);
  const code = timestampString.slice(0, insertionIndex) + stringToInsert + timestampString.slice(insertionIndex);
  const magicLink = domain + `?id=${id}&code=${code}`
  return {magicLink, code}
}