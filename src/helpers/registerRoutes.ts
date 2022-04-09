
    export default function(routesArray: any[]) {
        return routesArray.reduce((p, c) => p.concat(c), [])
    }