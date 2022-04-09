
    export default async function useTryCatch(promise: Promise < any > ) {
        try {
            return [await promise, null];
        } catch (e) {
            return [null, e];
        }
    }
    