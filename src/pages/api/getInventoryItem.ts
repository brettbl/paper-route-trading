export default async function getInventoryItem (pk: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BUBBLE_URL}/InventoryItem`;
        const headers = {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BUBBLE_TOKEN}`
        }
        
        const constraints = `[{"key":"publicKey","constraint_type":"equals","value":"${pk}"}]`;
        const params = new URLSearchParams({constraints:constraints})

        const response = await fetch(`${url}?${params}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Handle the response data here
        return data
    } catch (error) {
        // Handle the error here
        console.error(error);
        throw error;
    }
};
