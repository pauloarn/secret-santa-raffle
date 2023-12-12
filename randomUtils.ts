export const selectNumberInRange = (maxLimit: number) => {
    let rand = Math.random() * maxLimit
    rand = Math.floor(rand)

    return rand
}

export const getRandomItemFromArray = <T>(lista: T[]) => {
    const randomIndex= selectNumberInRange(lista.length - 1)
    return {
        index: randomIndex,
        item:lista[randomIndex]
    }
}
