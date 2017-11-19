'use strict'

/**
 * We start with a list of participants and people they can't buy for, for convenience.
 * We need to turn this into a list of people that they can buy for.
 * @param {object} obj - exported from data.js
 * @returns {object}
 */
const convertExcludesToIncludes = obj => {
  const peopleIncludes = {}
  for (let key in obj) {
    peopleIncludes[key] = Object.keys(obj).filter(x => !obj[key].includes(x))
  }
  return peopleIncludes
}

/**
 * We're going to modify the object key so it is in the form: "name-length_of_recipients_list"
 * This is a convenient form for sorting
 * @param {obj} obj - data from data.js, maniupulated by convertExcludesToIncludes
 * @returns {object}
 */
const addArrayLengthToKey = obj => {
  const peopleWithNewKey = {}
  for (let key in obj) {
    let newKey
    if (key.indexOf('-') === - 1)
      newKey = key
    else
      newKey = key.split('-')[0]
    peopleWithNewKey[`${newKey}-${obj[key].length}`] = obj[key]
  }
  return peopleWithNewKey
}

/**
 * Sort the object by the length of the recipients list, now included in the object key
 * @param {object} obj - In form returned by addArrayLengthToKey
 * @returns {object}
 */
const sortPeopleByKeyNumber = obj => {
  const sortedPeople = {};
  Object.keys(obj)
    .sort((a, b) => Number(a.split('-')[1]) > Number(b.split('-')[1]) ? 1 : -1)
    .forEach(key => sortedPeople[key] = obj[key])
  return sortedPeople 
}

/**
 * From our prepared data, return a map of assignations
 * @param {*} obj - In form returned by addArrayLengthToKey
 * @param {*} randomFunction - Provide when testing to override use of Math.random()
 * @returns {object}
 */
const makePairings = (obj, randomFunction = obj => obj[Math.floor(Math.random() * obj.length)]) => {
  const pairings = {}
  while (Object.keys(obj).length) {
    // Place the person with the least number of possible recipients first, assign them a match randomly
    // Remove this person from obj and that recipient from all further lists
    obj = sortPeopleByKeyNumber(obj)
    const buyerKey = Object.keys(obj)[0]
    const buyerName = buyerKey.split('-')[0]
    const receiverName = randomFunction(obj[buyerKey])
    const receiverKey = Object.keys(obj).find(x => x.indexOf(receiverName) !== - 1)

    // If a buys for b, we don't want b to buy for a
    if (receiverKey)
      obj[receiverKey] = obj[receiverKey].filter(x => x !== buyerName)

    for (let key in obj)
      obj[key] = obj[key].filter(x => x !== receiverName)

    delete obj[buyerKey]
    obj = addArrayLengthToKey(obj)
      
    if (receiverName)
      pairings[buyerName] = receiverName
    else {
      console.error('Error: no solution exists for this data')
      return null
    }
  }
  return pairings
}

/**
 * Diseminate results
 * @param {*} peopleWithEmails 
 * @param {*} peopleWithRecipients 
 */
const sendMessages = (peopleWithEmails, peopleWithRecipients) => {
  try {
    // for each peopleWithRecipients, write the result to a text file. Place in results dir
    const fs = require('fs')
    const resultsDirectory = './results'
    if (!fs.existsSync(resultsDirectory))
      fs.mkdirSync(resultsDirectory)
    else {
      const files = fs.readdirSync(resultsDirectory)
      files.forEach(x => fs.unlinkSync(`${resultsDirectory}/${x}`))
    }
    for (let key in peopleWithRecipients)
      fs.writeFileSync(`${resultsDirectory}/${key}.txt`, `${key} is buying for ${peopleWithRecipients[key]}`)

    console.log(`Results written to ${resultsDirectory}`)
    return true
  }
  catch (e) {
    return false
  }
}

module.exports = {
  convertExcludesToIncludes,
  addArrayLengthToKey,
  sortPeopleByKeyNumber,
  makePairings,
  sendMessages
}
