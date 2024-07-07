require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GROUP_ID = process.env.GROUP_ID;

app.get('/org/ballerinalang/:package/:version/:file', async (req, res) => {
    try {
        // checks if path starts with GROUPID
        const pattern = new RegExp(`^\/${GROUP_ID}\/(.+)$`);

        const match = req.path.match(pattern);
        if (!match) {
            return res.status(404).send('Invalid path: ' + req.path);
        }
        console.log(req.params.package);
        console.log(req.params.version);
        console.log(req.params.file);
        const targetURL = `https://maven.pkg.github.com/${GITHUB_ORG}/${GITHUB_REPO}/org/ballerinalang/${req.params.package}/${req.params.version}/${req.params.file}`;
        const response = await axios.get(targetURL, {
            responseType: 'stream',
            headers: { 
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Host': 'maven.pkg.github.com'
            },
            validateStatus: function (status) {
                return status >= 200 && status < 303;
            },
            maxRedirects: 5
        });
        // Check if the response is a redirect
        if (response.status === 302) {
            // Redirect user to the URL provided in the Location header
            const redirectUrl = response.headers.location;
            res.redirect(302, redirectUrl);
        } else {
            // Handle non-redirect responses
            res.set(response.headers);
            response.data.pipe(res);
        }
    } catch (error) {
        console.error(error.response.data);
        res.status(error.response ? error.response.status : 500).send('Unknown error');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
