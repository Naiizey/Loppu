/**
 * Function ajaxRequest
 * 
 * @param { {method: string, url: string, filter: any} } params
 */
export const ajaxRequest = (params) => {
    const req = new XMLHttpRequest();

    if(params.method && params.url){
        const method = params.method;
        let url = params.url;

        if(params.filter){
            url += "?";
            for(let filter in params.filter){
                if(params.filter.hasOwnProperty(filter)){
                    url += `${filter}=${params.filter[filter]}?`
                }
            }
        }

        req.open(method, url);
    }
}