const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { query, type, id } = req.query;
    let url = 'https://api.geekdo.com/xmlapi2/';
    
    if (id) {
        url += `thing?id=${id}&stats=1`;
    } else if (query) {
        url += `search?query=${encodeURIComponent(query)}&type=${type || 'boardgame'}`;
    } else {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(text);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from BGG API' });
    }
}; 