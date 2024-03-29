function minimum(nb1, nb2, nb3){
    return Math.min(nb1, nb2, nb3);
}

function levenshtein(chaine1, chaine2){
    /*
    chaine1 : string
    chaine2 : string

    return : int

    Cette fonction prend en paramètre deux chaînes de caractères 
    et retourne la distance entre ces deux chaînes.
    */

    let chaine1_formatted = chaine1.toLowerCase();
    let chaine2_formatted = chaine2.toLowerCase();
    let distance = new Array(chaine1_formatted.length + 1).fill(0).map(() => new Array(chaine2_formatted.length + 1).fill(0));
    let i, j, cost;

    for(let i = 0; i <= chaine1_formatted.length; i++){
        distance[i][0] = i;
    }
    for(let j = 0; j <= chaine2_formatted.length; j++){
        distance[0][j] = j;
    }

    for(let i = 1; i <= chaine1_formatted.length; i++){
        for(let j = 1; j <= chaine2_formatted.length; j++){
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

function est_dict(phrase, dictionnaire, distance){
    /*
    phrase : string
    dictionnaire : array
    distance : int

    return : boolean

    Cette fonction prend en paramètre une phrase, un dictionnaire et une distance. 
    Elle retourne true si un mot de la phrase est proche d'un mot du dictionnaire.
    Sinon, elle retourne false.
    La distance est le nombre de caractères de différence minimal entre un mot de 
    la phrase et un mot du dictionnaire pour que la fonction retourne true.
    */
    let mots = phrase.split(" ");
    for(let i = 0; i < mots.length; i++){
        for(let j = 0; j < dictionnairet.length; j++){
            if(levenshtein(mots[i], dictionnaire[j]) <= distance){
                return true;
            }
        }
    }
    return false;
}
