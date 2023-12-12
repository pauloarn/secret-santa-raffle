export const selectNumberInRange = (maxLimit: number) => {
    let rand = Math.random() * maxLimit
    rand = Math.floor(rand)

    return rand
}

export const getRandomItemFromArray = <T>(lista: T[]) => {
    const listaLength = lista.length
    const randomIndex= selectNumberInRange(listaLength)
    return {
        index: randomIndex,
        item:lista[randomIndex]
    }
}
