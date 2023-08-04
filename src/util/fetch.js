const apiUrl = 'http://localhost:8080';

export const fetchData = async (endpoint, options = {}, OpenGenericSnackBar) => {
    const url = `${apiUrl}/${endpoint}`;
    try {
        if (options.auth) {
            const { username, password } = options.auth;
            const encodedCredentials = btoa(`${username}:${password}`);
            options.headers = {
                ...options.headers,
                Authorization: `Basic ${encodedCredentials}`,
            };
        }
        const response = await fetch(url, options);
        const data = await response.text();
        if (!response.ok) {
            if (data.indexOf('message') !== -1) {
                throw new Error(JSON.parse(data).message);
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return [data, false];
    } catch (error) {
        console.error('API request failed:', error);
        OpenGenericSnackBar(true, error.message);
        return [undefined, true];
    }
};