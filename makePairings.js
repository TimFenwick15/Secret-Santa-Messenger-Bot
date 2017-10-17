const convertExcludesToIncludes = obj => {
  const peopleIncludes = {}
  for (key in obj) {
    peopleIncludes[key] = Object.keys(obj).filter(x => !obj[key].includes(x))
  }
  return peopleIncludes
}

const addArrayLengthToKey = obj => {
  const peopleWithNewKey = {}
  for (key in obj) {
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
    const currentKey = Object.keys(obj)[0]
    pairings[currentKey.split('-')[0]] = obj[currentKey][Math.floor(Math.random() * obj[currentKey].length)]
    for (remainingKeys in obj) {
      obj[remainingKeys] = obj[remainingKeys].filter(x => x !== pairings[currentKey.split('-')[0]])
    }
    delete obj[currentKey]
    obj = addArrayLengthToKey(obj)
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
