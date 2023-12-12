import {randomUUID} from "node:crypto";
import {getRandomItemFromArray} from "../randomUtils";

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


const friendsList: FriendsData[] = [] //FRIENDS LIST O BE RAFFLED, FIELD EMAIL WILL BE USED TO SEND EMAIL WITH THE RAFFLED FRIEND NAME


export const selectFriends = () =>{
    const imutedFriends  = friendsList.map((f) => {
        return {
            ...f,
            id: randomUUID().toString()
        }
    })
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
    })
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
    })

    console.log('amigos sorteados')
    return organizedSortedFriends
}
