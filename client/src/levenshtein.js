function minimum(nb1, nb2, nb3){
    return Math.min(nb1, nb2, nb3);
}

/**
 * @function levenshtein
 * 
 * @param {string} chaine1
 * @param {string} chaine2
 * 
 * @returns {number}
 * 
 * @description This function takes two strings as parameters and returns the distance between these two strings.
 */
function levenshtein(chaine1, chaine2){
    let chaine1_formatted = chaine1.toLowerCase();
    let chaine2_formatted = chaine2.toLowerCase();

    let distance = new Array(chaine1_formatted.length + 1).fill(0).map(() => new Array(chaine2_formatted.length + 1).fill(0));
    let i, j, cost;

    for(i = 0; i <= chaine1_formatted.length; i++){
        distance[i][0] = i;
    }
    for(j = 0; j <= chaine2_formatted.length; j++){
        distance[0][j] = j;
    }

    for(i = 1; i <= chaine1_formatted.length; i++){
        for(j = 1; j <= chaine2_formatted.length; j++){
            if(chaine1_formatted[i-1] === chaine2_formatted[j-1]){
                cost = 0;
            }else{
                cost = 1;
            }
            distance[i][j] = minimum(
                // effacement du nouveau caractère de chaine1
                distance[i-1][j] + 1,
                // insertion dans chaine2 du nouveau
                // caractère de chaine1
                distance[i][j-1] + 1,
                // substitution
                distance[i-1][j-1] + cost
            );
        }
    }
    return distance[chaine1_formatted.length][chaine2_formatted.length];
}

/**
 * @function est_dict
 * 
 * @param {string} phrase
 * @param {array} dictionnaire
 * @param {number} distance
 * @param {string} couleur
 * 
 * @returns {string}
 * 
 * @description This function takes a phrase, a dictionary, a minimum distance, and a hexadecimal color code as parameters.
 */
function est_dict(phrase, dictionnary, distance, color){
    let mots = phrase.split(" ");
    for(let i = 0; i < mots.length; i++){
        for(let j = 0; j < dictionnary.length; j++){
            if(levenshtein(mots[i], dictionnary[j]) <= distance){
                mots[i] = "<span style='color:" + color + " !important;'>" + mots[i] + "</span>";
            }
        }
    }
    return mots.join(" ");
}

export default est_dict;
