import {randomUUID} from "node:crypto";
import {getRandomItemFromArray} from "../randomUtils";
import fs from "fs";

export interface OrganizedAndSortedFriends {
    origin: FriendsDataWithId
    selected: FriendsDataWithId
}
export interface FriendsData{
    name: string
    email: string
}

export interface FriendsDataWithId extends FriendsData{
    id: string
}



const getFriendsFromFile = async () =>{
    const fileString = await fs.readFileSync('./data/responses.json',  {encoding:'utf8', flag:'r'})
    const friendsList: FriendsData[] = JSON.parse(fileString)

    return friendsList
}


export const selectFriends = async () =>{
    const friendsList = await getFriendsFromFile()
    const imutedFriends  = friendsList.map((f) => {
        return {
            ...f,
            id: randomUUID().toString()
        }
    }) //Assign a uuid to every friend on list for better selector
    const friends: FriendsDataWithId[] = JSON.parse(JSON.stringify(imutedFriends))
    const selectedFriends:{origin: string, selected: string}[] = []
    imutedFriends.forEach((f) =>{
        const friendsToSelect = friends.filter((fs) => f.id !== fs.id)
        const selectedFriend = getRandomItemFromArray(friendsToSelect)
        selectedFriends.push({
            origin: f.id,
            selected: selectedFriend.item.id
        })
        friends.splice(selectedFriend.index,1)
    }) //Raffle friends
    const organizedSortedFriends: OrganizedAndSortedFriends[] = selectedFriends.map((sf) =>{
        const selected = imutedFriends.find((f) => f.id === sf.selected)
        const origin = imutedFriends.find((f) => f.id === sf.origin)
        if(selected && origin){
            return{
                origin,
                selected
            }
        }
        throw new Error(`FALHA AO ORGANIZAR SORTEIO`)
    })//Organize raffled friends with original data

    console.log('amigos sorteados')
    return organizedSortedFriends
}
