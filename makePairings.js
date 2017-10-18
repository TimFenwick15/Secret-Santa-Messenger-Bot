'use strict'

const convertExcludesToIncludes = obj => {
  const peopleIncludes = {}
  for (let key in obj) {
    peopleIncludes[key] = Object.keys(obj).filter(x => !obj[key].includes(x))
  }
  return peopleIncludes
}

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

const sortPeopleByKeyNumber = obj => {
  const sortedPeople = {};
  Object.keys(obj)
    .sort((a, b) => Number(a.split('-')[1]) > Number(b.split('-')[1]) ? 1 : -1)
    .forEach(key => sortedPeople[key] = obj[key])
  return sortedPeople 
}

const makePairings = obj => {
  const pairings = {}
  while (Object.keys(obj).length) {
    obj = sortPeopleByKeyNumber(obj)
    const buyerKey = Object.keys(obj)[0]
    const buyerName = buyerKey.split('-')[0]
    const receiverName = obj[buyerKey][Math.floor(Math.random() * obj[buyerKey].length)]
    const receiverKey = Object.keys(obj).find(x => x.indexOf(receiverName) !== - 1)

    // If a buys for b, we don't want b to buy for a
    if (receiverKey)
      obj[receiverKey] = obj[receiverKey].filter(x => x !== buyerName)

    for (let key in obj)
      obj[key] = obj[key].filter(x => x !== receiverName)

    delete obj[buyerKey]
    obj = addArrayLengthToKey(obj)
      
    pairings[buyerName] = receiverName
  }
  return pairings
}

const sendMessages = (peopleWithEmails, peopleWithRecipients) => {
  try {
    console.dir(peopleWithRecipients)
    return true
  }
  catch (e) {
    return false
  }
}

const data = require('./data')
let people = {}
for (let key in data)
  people[key] = data[key].excludes

const peopleWithIncludesLists = convertExcludesToIncludes(people)
const peopleWithIncludesLengthKeys = addArrayLengthToKey(peopleWithIncludesLists)
const pairings = makePairings(peopleWithIncludesLengthKeys)
if (!sendMessages(data, pairings))
  console.error('Email sending failed :(')
